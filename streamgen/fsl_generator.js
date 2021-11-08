const fs = require('fs');
const request = require('request')
var cheerio = require('cheerio')
var md5 = require('md5');
var { titleCase } = require("title-case");
require('datejs')

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

module.exports = async function getFSLStreams(category, league, webLink) {


    refspec = {}
    games = []

    result = await get(webLink);

    var $ = cheerio.load(result);
    $('tbody#myTable tr').each(function (index, element) {
        
        var gamedata = cheerio.load("<div>" + $(element).html() + "</div>")

        var gameday = {};

        var game_time = $($(element).find("td")[0]).text().trim();
        var game_title = $($(element).find("td")[2]).text().trim().replace("\nvs\n", ' vs ').replace('\n', ' ');

        gamedata('a.button').each(function(index, element) {
            var link = gamedata(element).attr('href')
            var name = gamedata(element).text()
            refspec[md5(link)] = {"url": link, "site": "fsl", "title": game_title};
            gameday[titleCase(name.toLowerCase())] = md5(link);
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

        games.push(game);

    });

    gm = {}
    gm[category] = games;

    return {
        games: gm,
        refspec: refspec
    };
    
}