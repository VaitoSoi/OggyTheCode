const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildid: String,
    guildname: String,
    config: Object,
})

module.exports = mongoose.model('option', Schema)