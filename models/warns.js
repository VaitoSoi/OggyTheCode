const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    username: String,
    guildid: String,
    user: String,
    content: Array,
})

module.exports = mongoose.model('warns', Schema)