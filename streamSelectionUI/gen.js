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
        var vc;
        switch(game['league']) {
            case "National Football League":
                vc="NFL";break;
            case "Major League Baseball":
                vc="MLB";break;
            case "National Hockey League":
                vc="NHL";break;
            case "NCAA Football":
                vc="CFB";break;
            case "Soccer (League Unknown)":
                vc="";break;
        }

        tableOutput += `
        <tr>
        <td class=${vc}>${game['league']}</td>
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