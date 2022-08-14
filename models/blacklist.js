const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    tag: String,
    id: String,
    reason: String,
    by: String,
    type: String,
    at: String,
    end: String,
})

module.exports = mongoose.model('blacklist', Schema)