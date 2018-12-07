


const text = document.getElementById("writtenText");

const button = document.getElementById("showText");

//testObject will store the inputted text
var testObject;

var nonLex = [
    'to',
    'got',
    'is',
    'have',
    'and',
    'although',
    'or',
    'that',
    'when',
    'while',
    'a',
    'either',
    'more',
    'much',
    'neither',
    'my',
    'that',
    'the',
    'as',
    'no',
    'nor',
    'not',
    'at',
    'between',
    'in',
    'of',
    'without',
    'I',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'anybody',
    'one'
];

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

function checkNonLex(str) {
    var a = [];
    var total;
    nonLex.forEach(function(v, i){
        se = v;
        a[i] = check(str);
    });
    // console.log(arrSum(a));
    return arrSum(a);
}

function splitParagraphToSentences(str) {
    return str.match( /[^\.!\?]+[\.!\?]+/g );
}

function calculateLexicalDensity(str) {
    var nonLexTotal = checkNonLex(str);
    var totalWords = TotalWordCount(str);
    var lexWords = totalWords - nonLexTotal;
    return lexWords/totalWords
}

//Sets inputted text into Test object and simultaneously evaluates the text
button.addEventListener('click', function(){
    
    testObject = text.value.toLocaleLowerCase();
    
    var totalWords = TotalWordCount(testObject);
    var totalChars = TotalCharCount(testObject);
    //Wrap in an if clause to make sure words stay within limit
    if ((totalWords <= 100) && (totalChars <= 1000)) {

        //Calculate Total Lexical Density
        var lexDensity = calculateLexicalDensity(testObject);
        var old;
        old = Number(lexDensity.toFixed(2));

        //Calculate Lexical Density for Each Sentence
        var sentenceArray = splitParagraphToSentences(testObject);
        console.log(sentenceArray);
        var ldarr = [];
        sentenceArray.forEach(function(v, i){
            var sld = calculateLexicalDensity(v).toFixed(2);
            ldarr[i] = Number(sld);  
        });


        //Assign respective densities to objects 
        var overall = fillObjectData(old);
        var verbose = fillObjectDataVerbose(ldarr, old);

         //display results on screen and console
        console.log(overall);
        console.log(verbose);
        document.getElementById("demo").innerHTML = "The Overall Lexical Density is " + old;
        document.getElementById("demo2").innerHTML = "The Lexical Densities for each sentence are " + ldarr;
    }
    else {
        var output = "Sorry, too many words/characters";
        console.log(output);
        document.getElementById("demo").innerHTML = output;
    }
    
});


  
  