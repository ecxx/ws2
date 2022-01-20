const items = new (require('./items.js'))();
var md5 = require('md5');
const request = require('request')
var cheerio = require('cheerio')
const fs = require('fs');
var { titleCase } = require("title-case");
var { Liquid } = require('liquidjs');

var engine = new Liquid();

var template = fs.readFileSync('./src/video.html', 'utf8');

function identify_video(refspec) {

    return new Promise((resolve, reject) => {
        items.db.get("SELECT link, title, exturl FROM streams WHERE refspec = ?", refspec, function (err, row) {
            if (row==undefined) {resolve(false); return;}
            resolve( {
                link: row.link.split('|', 2),
                title: row.title,
                exturl: row.exturl
            } )
        })
    });

}

function freestreams(weblink) {

    return new Promise((resolve, reject) => {
        request(weblink, function (error, response, body) {
            if (error) {
                reject(body);
            }
            var $ = cheerio.load(body);
            var found = false;
            $('iframe').each(function (index, element) {
                if (found) {
                    return;
                }
                if ($(element).attr('loading') == "lazy") {
                    var url = $(element).attr('src');
                    resolve(url);
                    found=true;
                }
            });
            if (!found) {
                resolve("No Stream Found");
            }
        });
    })
    
}

module.exports = async function get_stream(ref, nosandbox = false) {

    var data = await identify_video(ref);

    if (!data) {
        return "<h3>An Error Occurred</h3><br><p>There was no stream with reference " + ref + " found.</p>";
    }
    switch (data.link[0]) {
        case 'fsl':
            data.truelink = await freestreams(data.link[1]);
            break;
        case 'link':
            data.truelink = data.link[1];
    }

    liquidopt = {}

    if (nosandbox) liquidopt['sandbox'] == "";
    else liquidopt['sandbox'] = `sandbox="allow-scripts allow-forms allow-same-origin"`

    liquidopt['streamtitle'] = data.title;
    liquidopt['weblink'] = data.exturl;
    liquidopt['streamlink'] = data.truelink;

    return new Promise((resolve, reject) => {
        
        engine
            .parseAndRender(template, liquidopt)
            .then(resolve);

    })

}