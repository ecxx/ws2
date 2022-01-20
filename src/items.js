const sqlite3 = require('sqlite3').verbose();
const { DBLogger } = require('nplog');

module.exports = class Items {

    constructor () {

        if (!Items._instance) {
            Items._instance = this;
        } else {
            return Items._instance;
        }

        this.db = new sqlite3.Database('./ws2.db');
        this.logger = new DBLogger('./ws2.db', {});
        this.streams = [];


    }

}