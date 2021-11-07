const fs = require('fs');
const request = require('request')
var cheerio = require('cheerio')

String.prototype.token_replace_multiple = function(obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(x, obj[x]);
    }
    return retStr;
};

var template = fs.readFileSync('./streams/video.html', 'utf8');

function generateStreamHTML(streamName, streamLink, webLink) {

    return template.token_replace_multiple({
        "[streamtitle]": streamName,
        "[streamname]": streamName,
        "[streamlink]": streamLink,
        "[weblink]": webLink
    })

}

function getStreamIFrameURL(webLink) {

    return new Promise((resolve, reject) => {
        request(webLink, function (error, response, body) {
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

module.exports = function getStream(webLink, streamName) {

    return new Promise((resolve, reject) => {
        getStreamIFrameURL(webLink).then((url) => {
            resolve(generateStreamHTML(streamName, url, webLink));
        }).catch((error) => {   
            reject(error);
        })
    })

}