var mongoose = require('mongoose');

var NonLexSchema = mongoose.Schema({
    data: {
        type: String
    },
});

module.exports = mongoose.model('Item', NonLexSchema);