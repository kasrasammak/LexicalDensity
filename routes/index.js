var express = require('express');
var router = express.Router();

var NonLex = require('../models/index');

var bodyParser = require('body-parser') 
var urlEncodedParser = bodyParser.urlencoded({extended: false})



//TEXT OBJECTS
//testObject will store the inputted text
var testObject;

//text stores the inputted text
var text = "Sample text.";

//LEXICAL DENSITY OBJECTS

//for showing on the screen
var obj = {
    old: null,
    ldarr: [],
};


//stores overall lexical density
var objectData = {
    "data": {
        overall_ld: null
    }
}

//stores overall lexical density and 
//individual sentence lexical densities
var objectDataVerbose =  {
    "data": {
        sentence_ld: [],
        overall_ld: null
    }  
}

//placeholder to loop through the mongodb array
//and plug into the regex object
var se;


//Fills respective Object Datas
function fillObjectData(ld) {
    objectData =  {
        "data": {
            overall_ld: ld
        }
    }
    return objectData
}

function fillObjectDataVerbose(arr, ld) {
    objectDataVerbose =  {
        "data": {
            sentence_ld: arr,
            overall_ld: ld
        }
    }
    return objectDataVerbose;
}

//Counts Total Words in a String
function TotalWordCount(str) { 
    return str.split(" ").length;
  }

//Counts Total Characters in a String
function TotalCharCount(str) {
    return str.length;
}

//check if non-lexical word appears in text
//returns amount of time word appears in text
function check(str) {
    var re = new RegExp(`\\b${se}\\b`, 'gi');
    if (str.match(re) === null) {
        return 0;
    }
    else {
    return str.match(re).length;
    }
}

//calculate sum of numeric values in an array,
//for calculating sum of non-lexical words in sentence or text
arrSum = function(arr){
    return arr.reduce(function(a,b){
      return a + b
    }, 0);
  }

//calls check method for each word in the array of non-lexical words
//returns total non-lexical words in the string
function checkNonLex(str, nonLex) {
    var a = [];
    nonLex.forEach(function(v, i){
        se = v;
        a[i] = check(str);
    });
    return arrSum(a);
}

//Splits paragraphs into sentences and returns
//sentences in an array
function splitParagraphToSentences(str) {
    return str.match(/[^\.!\?]+[\.!\?]+/g);
}

//pass a string and data of non-lexical items and 
//returns lexical density of the string
function calculateLexicalDensity(str, nonLex) {
    var nonLexTotal = checkNonLex(str, nonLex);
    var totalWords = TotalWordCount(str);
    var lexWords = totalWords - nonLexTotal;
    return (lexWords/totalWords)
}


//Pass Non-Lexical array from Mongo DB 
//evaluates the Inputted Text, returns object with overall lexical density 
//and array of each sentences lexical densities, respectively, 
// prints these values to the console
function CalculateOverallLD(nonLex){

    if (text === "" || null) {
        text = "Sample text.";
    }

    //Ignores case sensitivity of text by setting all to lower case
    testObject = text.toLocaleLowerCase();

     //Calculate Total Lexical Density
     var lexDensity = calculateLexicalDensity(testObject, nonLex);
     var old;
     old = Number(lexDensity.toFixed(2));

    //Assign respective densities to objects 
    var overall = fillObjectData(old);

    //print requested data in console   
    console.log(overall);

    return overall;
}

function MainEvent(nonLex){
    
    if (text === "") {
        text = "Sample text.";
    }

    //Ignores case sensitivity of text by setting all to lower case
    testObject = text.toLocaleLowerCase();

    //Calculate Total Lexical Density
    var lexDensity = calculateLexicalDensity(testObject, nonLex);
    var old;
    old = Number(lexDensity.toFixed(2));

    //Calculate Lexical Density for Each Sentence
    var sentenceArray = splitParagraphToSentences(testObject);
    var ldarr = [];
    let trim = sentenceArray.map(v => {return v.trim()});
    console.log(trim)
    trim.forEach(function(v, i){
        var sld = calculateLexicalDensity(v, nonLex);
        ldarr[i] = Number(sld.toFixed(2));  
    });

    //Assign densities to object
    var verbose = fillObjectDataVerbose(ldarr, old);

    //print requested data in console
    console.log(verbose);

    return verbose;
};


//displays the ejs page
router.get('/', function(req, res, next){
    res.render('index');
});

//reads input data from a request and stores it in the text variable
router.post('/posttext', urlEncodedParser, function(req, res, next){
    console.log(req.body.text)
    text = req.body.text;
        
    
});

//evaluates input data against data from mongodb and returns 
//sentence_ld & overall_ld, prints it in console
router.get('/verbose', function(req, res, next){
    NonLex.collection.distinct("data", function(err, results){
        if (err){
            res.send(err);
        }
        MainEvent(results);
    });
}); 
//evaluates input data against data from mongodb and returns 
//overall_ld, prints it in console
router.get('/complexity', function(req, res, next){
    NonLex.collection.distinct("data", function(err, results){
        if (err){
            res.send(err);
        }
        CalculateOverallLD(results);
        
    });
}); 



module.exports = router;
