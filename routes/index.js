var express = require('express');
var router = express.Router();

var NonLex = require('../models/index');

//testObject will store the inputted text
var testObject;

var objectData = {
    "data": {
        overall_ld: null
    }
}

var objectDataVerbose =  {
    "data": {
        sentence_ld: [],
        overall_ld: null
    }
    
}

var se;

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


function splitParagraphToSentences(str) {
    return str.match( /[^\.!\?]+[\.!\?]+/g );
}

//pass a string and data of non-lexical items and returns lexical density of the string
function calculateLexicalDensity(str, nonLex) {
    var nonLexTotal = checkNonLex(str, nonLex);
    var totalWords = TotalWordCount(str);
    var lexWords = totalWords - nonLexTotal;
    return lexWords/totalWords
}
var text = "Whatever is in the food is in the food man. Lets not think too much about it. Okay thats the case for us nineties babies."
//Pass Non-Lexical Density array from Mongo DB 
//evaluates the Inputted Text, returns object with overall lexical density 
//and array of each sentences lexical densities
function MainEvent(nonLex){
    console.log("It Worked!");
    
    testObject = text.toLocaleLowerCase();
    
    var totalWords = TotalWordCount(testObject);
    var totalChars = TotalCharCount(testObject);
    //Wrap in an if clause to make sure words stay within limit

    //Calculate Total Lexical Density
    var lexDensity = calculateLexicalDensity(testObject, nonLex);
    var old;
    old = Number(lexDensity.toFixed(2));

    //Calculate Lexical Density for Each Sentence
    var sentenceArray = splitParagraphToSentences(testObject);
    console.log(sentenceArray);
    var ldarr = [];
    sentenceArray.forEach(function(v, i){
        var sld = calculateLexicalDensity(v, nonLex).toFixed(2);
        ldarr[i] = Number(sld);  
    });
    console.log(ldarr);


    //Assign respective densities to objects 
    var overall = fillObjectData(old);
    var verbose = fillObjectDataVerbose(ldarr, old);

    //display results on screen and console
    console.log(overall);
    console.log(verbose);

    //creates packaged object to return for sending to the UI
    var obj = {
        old: old,
        ldarr: ldarr,
    }
    return obj
};





// router.get('/', function(req, res, next){
//     res.render('index');
// });


// router.get('/', function(req, res, next){
//     NonLex.getNonLexItems(function(err, items){
//         if (err){
//             res.send(err);
//         }
        
        
        
        
//         MainEvent();
//         res.json(items);
//         console.log(items);
//     },10);
// });

router.get('/', function(req, res, next){
        NonLex.collection.distinct("data", function(err, results){
            if (err){
                res.send(err);
            }
            MainEvent(results);
            res.json(results)
            console.log(results);
        }) 
        });




module.exports = router;

