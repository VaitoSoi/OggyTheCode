const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    id: String,
    name: String,
    reason: String,
    by: String,
})

module.exports = mongoose.model('blacklist', Schema)