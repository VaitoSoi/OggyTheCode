const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildid: String,
    name: String,
    reason: String,
})

module.exports = mongoose.model('blacklistguild', Schema)