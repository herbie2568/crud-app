const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const songSchema = new Schema ({
    title: String,
    artist: String,
    genre: [String],
    img: String,
    musicvideo: String

})

const Songdata = mongoose.model('Songdata', songSchema)

module.exports = Songdata
