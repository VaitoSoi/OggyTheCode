const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    name: String,
    death: {
        total: Number,
        record: Array
    },
    kill: {
        total: Number,
        record: Array
    },
    date: {
        join: Number,
        seen: Number
    }
})

module.exports = mongoose.model('player', Schema)