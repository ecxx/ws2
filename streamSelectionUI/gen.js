const fs = require('fs')

module.exports = function gen(games) {

    var GamesFlat = []
    for (i in games) {
        GamesFlat = GamesFlat.concat(games[i])
    }

    var index = fs.readFileSync('./streamSelectionUI/index.html', 'utf8')

    var tableOutput = `
    <table id="tableview">
    <tbody>
    `

    for (i in GamesFlat) {

        game = GamesFlat[i]

        buttons = ''

        for (i in game['gameday']) {
            buttons += `
        <button class='button2'><a style="color: white; text-decoration: none;" href='/watch/${game['gameday'][i]}'>${i}</a></button>
            `
        }
        var vc; var logo;
        switch(game['league']) {
            case "National Football League":
                vc="NFL";logo="<img src='/logo/nfl.svg' style='height:30px'></img>";break;
            case "Major League Baseball":
                vc="MLB";logo="<img src='/logo/mlb.png' style='height:30px'></img>";break;
            case "National Hockey League":
                vc="NHL";logo="<img src='/logo/nhl.svg' style='height:30px'></img>";break;
            case "NCAA Football":
                vc="CFB";logo="<img src='/logo/ncaa.jpg' style='height:30px'></img>";break;
            case "Soccer (League Unknown)":
                vc="";logo="<img src='/logo/soccer.png' style='height:30px'></img>";break;
        }

        tableOutput += `
        <tr>
        <td class=${vc}>${logo}</td>
        <td>${game['event_time']}</td>
        <td>${game['event']}</td>
        <td>${game['gametime']}</td>
        <td style='text-align: left'>${buttons}</td>
        </tr>
        `
        
    }

    tableOutput += "</tbody></table>"

    index = index.replace('[table]', tableOutput)

    return index;

}