const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildid : String,
    guildname : String,
    mute : String,
    restart : String,
    submit : Array,
})

module.exports = mongoose.model('setrole', Schema)