const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    temp: Number,
    name: String
});

module.exports = mongoose.model('Weather', weatherSchema);