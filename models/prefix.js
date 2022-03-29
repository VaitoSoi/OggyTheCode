const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    GuildId : String,
    Prefix : String,
    GuildName : String,
    UserId : String,
    UserName : String,
})

module.exports = mongoose.model('prefix', Schema)