const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildid : String,
    msgid : String
})

module.exports = mongoose.model('tempmusic', Schema)