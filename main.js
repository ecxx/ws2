const express = require('express')
const app = express()
const gen = require('./streamgen/generator.js')
const genUI = require('./streamSelectionUI/gen.js')
const freestreams = require('./streams/freestreams.js');
const path = require('path')

var refspec=0;
var games=0;

function refresh() {
    gen().then((result) => {
        refspec = result.refspec;
        games = result.games;
    }).catch((error) => {
        console.log(error)
    })
}

refresh();

app.get('/', function (req, res) {
    if (refspec==0) {
        gen().then((result) => {
            refspec = result.refspec;
            games = result.games;
            res.send(genUI(games))
        }).catch((error) => {
            console.log(error)
            res.send("a problem was detected");
        })
    } else {
        res.send(genUI(games))
    }
})
 
app.get('/streams', function (req, res) {
    if (refspec==0) {
        gen().then((result) => {
            refspec = result.refspec;
            games = result.games;
            res.json(games)
        }).catch((error) => {
            console.log(error)
            res.send("a problem was detected");
        })
    } else {
        res.json(games)
    }
})

app.get('/refresh', function (req, res) {
    refresh();
    res.json({"refresh": "refresh in progress"})
})

app.use(express.static(__dirname+'/public'));

app.get('/watch/:md5', function(req, res) {
    game = refspec[req.params['md5']];
    freestreams(game['url'], game['title']).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.send("an error occured.")
    })
})
 
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});