const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildid : String,
    guildname : String,
    commands : Array,
})

module.exports = mongoose.model('disable-commands', Schema)