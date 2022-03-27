const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    userid : String,
    username: String,
    type: String,
    submit: Array,
})

module.exports = mongoose.model('tempsubmit', Schema)