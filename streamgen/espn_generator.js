var md5 = require('md5');
const request = require('request')

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

function espn_fsl_nfl(json_body) {

    refspec = {}
    games = []

    var season_type;
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

    json_body['events'].forEach(function (event) {

        home_team = event['name'].split(' at ')[1]
        home_link = "http://1m.freestreams-live1.com/" + home_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        home_base = encode(home_link)
        away_team = event['name'].split(' at ')[0]
        away_link = "http://1m.freestreams-live1.com/" + away_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        away_base = encode(away_link)

        games.push({
            "league": "National Football League",
            "week": season_type,
            "home": home_team,
            "away": away_team,
            "event": event['name'],
            "gametime": event['status']['type']['shortDetail'],
            "status": event['status']['type']['state'],
            "event_time": new Date(Date.parse(event['date'])).toLocaleString('en-SG'),
            "gameday": {"Home": home_base, "Away": away_base}
        })

        refspec[home_base] = {"url": home_link, "site": "fsl", "title": event['name']}
        refspec[away_base] = {"url": away_link, "site": "fsl", "title": event['name']}

    });

    return {
        games: games,
        refspec: refspec
    }

}

function espn_fsl_mlb(json_body) {

    refspec = {}
    games = []

    var season_type;
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

    json_body['events'].forEach(function (event) {

        home_team = event['name'].split(' at ')[1]
        home_link = "http://1m.freestreams-live1.com/" + home_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        home_base = encode(home_link)
        away_team = event['name'].split(' at ')[0]
        away_link = "http://1m.freestreams-live1.com/" + away_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        away_base = encode(away_link)

        games.push({
            "league": "Major League Baseball",
            "week": season_type,
            "home": home_team,
            "away": away_team,
            "event": event['name'],
            "gametime": event['status']['type']['shortDetail'],
            "status": event['status']['type']['state'],
            "event_time": new Date(Date.parse(event['date'])).toLocaleString('en-SG'),
            "gameday": {"Home": home_base, "Away": away_base}
        })

        refspec[home_base] = {"url": home_link, "site": "fsl", "title": event['name']}
        refspec[away_base] = {"url": away_link, "site": "fsl", "title": event['name']}

    });

    return {
        games: games,
        refspec: refspec
    }

}

function espn_fsl_nba(json_body) {

    refspec = {}
    games = []

    var season_type;
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

    json_body['events'].forEach(function (event) {

        home_team = event['name'].split(' at ')[1]
        home_link = "http://1m.freestreams-live1.com/" + home_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        home_base = encode(home_link)
        away_team = event['name'].split(' at ')[0]
        away_link = "http://1m.freestreams-live1.com/" + away_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        away_base = encode(away_link)

        games.push({
            "league": "National Basketball League",
            "week": season_type,
            "home": home_team,
            "away": away_team,
            "event": event['name'],
            "gametime": event['status']['type']['shortDetail'],
            "status": event['status']['type']['state'],
            "event_time": new Date(Date.parse(event['date'])).toLocaleString('en-SG'),
            "gameday": {"Home": home_base, "Away": away_base}
        })

        refspec[home_base] = {"url": home_link, "site": "fsl", "title": event['name']}
        refspec[away_base] = {"url": away_link, "site": "fsl", "title": event['name']}

    });

    return {
        games: games,
        refspec: refspec
    }

}

function espn_fsl_nhl(json_body) {

    refspec = {}
    games = []

    var season_type;
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

    json_body['events'].forEach(function (event) {

        home_team = event['name'].split(' at ')[1]
        home_link = "http://1m.freestreams-live1.com/" + home_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        home_base = encode(home_link)
        away_team = event['name'].split(' at ')[0]
        away_link = "http://1m.freestreams-live1.com/" + away_team.toLowerCase().replace(/\s/g, '-') + "-live-stream/"
        away_base = encode(away_link)

        games.push({
            "league": "National Hockey League",
            "week": season_type,
            "home": home_team,
            "away": away_team,
            "event": event['name'],
            "gametime": event['status']['type']['shortDetail'],
            "status": event['status']['type']['state'],
            "event_time": new Date(Date.parse(event['date'])).toLocaleString('en-SG'),
            "gameday": {"Home": home_base, "Away": away_base}
        })

        refspec[home_base] = {"url": home_link, "site": "fsl", "title": event['name']}
        refspec[away_base] = {"url": away_link, "site": "fsl", "title": event['name']}

    });

    return {
        games: games,
        refspec: refspec
    }

}


module.exports = async function espn_fsl() {

    mlbdata = espn_fsl_mlb(JSON.parse(await get("https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard")))
    nfldata = espn_fsl_nfl(JSON.parse(await get("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard")))
    nhldata = espn_fsl_nhl(JSON.parse(await get("https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard")))
    nbadata = espn_fsl_nba(JSON.parse(await get("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard")))

    games = {
        "ESPN: NFL": nfldata.games,
        "ESPN: NHL": nhldata.games,
        "ESPN: MLB": mlbdata.games,
        "ESPN: NBA": nbadata.games,
    }

    refspec = {
    }

    Object.assign(refspec, mlbdata.refspec)
    Object.assign(refspec, nhldata.refspec)
    Object.assign(refspec, nfldata.refspec)
    Object.assign(refspec, nbadata.refspec)

    return {
        games: games,
        refspec: refspec
    }

}