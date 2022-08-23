const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    name: String,
    death: {
        num: Number,
        first: String,
        last: String
    },
    kill: {
        num: Number,
        first: String,
        last: String
    },
    date: {
        seen: Number,
        join: Number
    }
})

module.exports = mongoose.model('player', Schema)