const items = new (require('./items.js'))();
var md5 = require('md5');
const request = require('request')
var cheerio = require('cheerio')
const fs = require('fs');
var { titleCase } = require("title-case");


var is_updating = false;
var temp_streams = [];
var hash_refs = {};

function get(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}

function encode(string) {
    return md5(string);
}

function getunique(string) {

    if (hash_refs[string] == undefined) {
        hash_refs[string] = 0;
        return string + ":0";
    } else {
        hash_refs[string]++;
        return string + `:${hash_refs[string]}`;
    }

}

module.exports = async function update() {

    if (is_updating)return;

    is_updating = true;

    temp_streams = [];
    hash_refs = {};

    items.db.run("DELETE FROM streams WHERE permanent = 0;");

    await espn_parse("https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard", "National Hockey League");
    await espn_parse("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard", "National Football League");
    await espn_parse("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard", "National Basketball Association");
    await espn_parse("https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard", "Major League Baseball");
    await fsl_parse("NCAA Football", "http://vod.freestreams-live1.com/ncaaf-live-streams/");
    await fsl_parse("Soccer (League Unknown)", "http://vod.freestreams-live1.com/football-streamz5/");
    items.streams = temp_streams;

    is_updating = false;

}

async function espn_parse(link, league) {

    json_body = JSON.parse(await get(link));

    games = []

    var season_type;

    if (league=='National Football League') {
        switch (json_body['season']['type']) {
            case 1:
                season_type = "Preseason Week " + json_body['week']['number']
                break;
            case 2:
                season_type = "Week " + json_body['week']['number']
                break;
            case 3:
                season_type = "Postseason Week " + json_body['week']['number']
                break;
        }
    } else {
        switch (json_body['season']['type']) {
            case 1:
                season_type = "Preseason | " + json_body['day']['date']
                break;
            case 2:
                season_type = json_body['day']['date']
                break;
            case 3:
                season_type = "Postseason | " + json_body['day']['date']
                break;
        }
    }

    for (event of json_body['events']) {

        

        var home_team = event['name'].split(' at ')[1]
        var home_link = "http://1m.freestreams-live1.com/" + home_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        var home_base = getunique(encode(home_link));
        var away_team = event['name'].split(' at ')[0]
        var away_link = "http://1m.freestreams-live1.com/" + away_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        var away_base = getunique(encode(away_link));

        temp_streams.push({
            "league": league,
            "week": season_type,
            "home": home_team,
            "away": away_team,
            "event": event['name'],
            "gametime": event['status']['type']['shortDetail'],
            "status": event['status']['type']['state'],
            "event_time": new Date(Date.parse(event['date'])).toLocaleString('en-SG'),
            "gameday": {"Home": home_base, "Away": away_base}
        })

        items.db.run(`INSERT INTO streams ( refspec, link, title, exturl ) VALUES ( "${home_base}", "fsl|${home_link}", "${event['name']}", "${home_link}" )`)
        items.db.run(`INSERT INTO streams ( refspec, link, title, exturl ) VALUES ( "${away_base}", "fsl|${away_link}", "${event['name']}", "${away_link}" )`)

    }
    

}

async function fsl_parse(league, webLink) {

    var result = await get(webLink);

    var $ = cheerio.load(result);
    $('tbody#myTable tr').each(function (index, element) {
        
        var gamedata = cheerio.load("<div>" + $(element).html() + "</div>")

        var gameday = {};

        var game_time = $($(element).find("td")[0]).text().trim();
        var game_title = $($(element).find("td")[2]).text().trim().replace("\nvs\n", ' vs ').replace('\n', ' ');

        gamedata('a.button').each(function(index, element) {
            var link = gamedata(element).attr('href')
            var encoded = getunique(encode(link));
            var name = gamedata(element).text()
            gameday[titleCase(name.toLowerCase())] = encoded;

            items.db.run(`INSERT INTO streams ( refspec, link, title, exturl ) VALUES ( "${encoded}", "fsl|${link}", "${game_title}", "${link}" )`)
        })

        gamedate = titleCase($('.elementor-heading-title').html().toLowerCase())

        var game = {
            "league": league,
            "week": gamedate,
            "event": game_title,
            "gametime": "Status Unknown",
            "status": "Status Unknown",
            "event_time": new Date(Date.parse(gamedate + " " + new Date().getFullYear() + " " + game_time)).toLocaleString('en-SG'),
            "gameday": gameday
        }

        temp_streams.push(game);

    });
    
}