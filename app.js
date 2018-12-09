var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var assert = require('assert');
var ejs = require('ejs');

var path = require('path');

var port = 3000;

mongoose.connect('mongodb://localhost/mongoLex');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function(){
    console.log('MongoDB Connected');
});

var routes = require('./routes/index');

//Instantiate express application
var app = express();


//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(function(req, res, next){
	console.log('Time: ', Date.now());
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Allows you to use static pages
app.use(express.static(path.join(__dirname, 'public')));

app.use('/page', routes)

app.get('/duh', function(req, res){
	res.send('Hello World!');
});

app.get('/about', function(req, res){
	res.send('About Page');
});


// var url = 'mongodb://localhost:27017/nonlexicalitems'
// app.get('/get-data', function(req, res, next) {
//     var resultArray = [];
//     mongo.connect(url, function(err, db) {
//       assert.equal(null, err);
//       var cursor = db.collection('items').find();
//       cursor.forEach(function(doc, err) {
//         assert.equal(null, err);
//         resultArray.push(doc);
//       }, function() {
//         db.close();
//         res.render('index', {items: resultArray});
//         console.log(resultArray)
//       });
//     });
//   });


app.listen(port, function() {
    console.log('Server started on port '+port);
});


module.exports = app;