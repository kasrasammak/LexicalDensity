var assert = require('assert');
var expect = require('chai').expect;

var chai = require('chai');

var server = require('../routes/index');

//Sample Text for Testing
var text = "Whatever is in the food is in the food. Lets not think too much about it. Lets just continue to write more code."

//Counts Total Words in a String
function TotalWordCount(str) { 
    return str.split(" ").length;
  }

//Counts Total Characters in a String
function TotalCharCount(str) {
    return str.length;
}

//Test
var expect = require('chai').expect
var words = TotalWordCount(text);
var chars = TotalCharCount(text);
describe('words and chars', function() {
  it('must be below 100 words', function(done){
    expect(words).to.lessThan(100);
    done()
  });
  it('must be below 1000 characters', function(done){
      expect(chars).to.lessThan(1000);
      done();
  });
});