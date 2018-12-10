var mongoose = require('mongoose');

var NonLexSchema = mongoose.Schema({
    data: {
        type: String
    },
});

const NonLex = module.exports = mongoose.model('Item', NonLexSchema);