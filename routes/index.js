var express = require('express');
var router = express.Router();

var NonLex = require('../models/index');

router.get('/', function(req, res, next){
    res.render('INDEX');
});

router.get('/nonlex', function(req, res, next){
    NonLex.getNonLexItems(function(err, items){
        if (err){
            res.send(err);
        }
        res.json(items);
        console.log(items);
    },10);
});
module.exports = router;

