var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var path = require('path');

const port = 3000;

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

//Logs the date/time each time you refresh
app.use(function(req, res, next){
	console.log('Time: ', Date.now());
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Allows you to use static pages
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes)

app.listen(port, function() {
    console.log('Server started on port '+port);
});


module.exports = app;