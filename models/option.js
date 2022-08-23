const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildid: String,
    guildname: String,
    config: {
        channels: {
            livechat: String,
            status: String,
            restart: String,
        },
        messages: {
            status: String,
            restart: String,
        },
        roles: {
            restart: String,
        },
        chatType: String,
        timestamp: String,
        join_leave: String,
        //prefix: String,
    }
})

module.exports = mongoose.model('option', Schema)