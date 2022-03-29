const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildid : String,
    guildname : String,
    mute : String,
    ban : String,
    kick : String,
    warn : String,
    welcome : String,
    goodbye : String,
    livechat : String,
    submit : String,
    submitshow : String,
    submitnoti : String,
})

module.exports = mongoose.model('setchannel', Schema)