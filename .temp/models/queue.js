const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    queue: Number,
    timecode : String,
    restart : Boolean,
    id: String
})

module.exports = mongoose.model('queue', Schema)