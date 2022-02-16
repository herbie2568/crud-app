const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const songnumberSchema = new Schema ({
    howManySongs: String

})

const Songnumber = mongoose.model('Songnumber', songnumberSchema)

module.exports = Songnumber
