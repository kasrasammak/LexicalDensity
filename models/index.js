var mongoose = require('mongoose');

var NonLexSchema = mongoose.Schema({
    nonLex: {
        type: Array
    },
});

var NonLex = module.exports = mongoose.model('Item', NonLexSchema);

module.exports.getNonLexItems = function(callback, limit){
    NonLex.find(callback).limit(limit);
} 

