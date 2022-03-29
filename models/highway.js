const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    which : String,
    xplus : String,
    xminus : String,
    zplus : String,
    zminus : String,
})

module.exports = mongoose.model('highway', Schema)