require('module-alias/register');
var express = require('express');
var app = express();
const items = new (require('./src/items.js'))();
const update = require('./src/generate_stream.js')
const get_stream = require('./src/get_stream.js');
const fs = require('fs');

update();

app.get('/streams', function(req, res) {

    res.json(items.streams);
    
})

app.get("/", async function(req, res) {
    res.send(await fs.readFileSync('src/homepage.html', 'utf-8'))
});

app.get('/watch/:md5', async function(req, res) {

    res.send(await get_stream(req.params.md5, req.query.nosandbox))

})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
    items.logger.info("Server running on port ", process.env.PORT || 3000);
})