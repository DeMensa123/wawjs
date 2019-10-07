const assert = require("assert");

describe("Exploratory tests - string", function() {

  it("String can be concatenated with + operator", function() {
    let a = "cats";
    let b = "dogs";
    let c = a + " and " + b;
    assert.strictEqual(c, "cats and dogs");
  });

  it("String can be concatenated with templated literal", function() {
    let a = "cats";
    let b = "dogs";
    let c = `${a} and ${b}`;
    assert.strictEqual(c, "cats and dogs");
  });

  it("Pad all strings to size of longest", function() {
    const strings = ["a", "bb", "ccc"];
    let max = 0;
    for (let i =0; i < strings.length; i++){
      max = Math.max(strings[i].length,max);
    }
    let result = [];
    for(let i = 0; i < strings.length; i++){
      result[i] = strings[i].padStart(max,' ');
    }
    
    assert.deepStrictEqual(result, ["  a", " bb", "ccc"]);
  });

  it("replace all animals in sentence", function() {
    const sentence = "cats ignore dogs";
    let result;
    result = sentence.replace(/(\bcats\b|\bdogs\b)/g, "");
    assert.strictEqual(result, " ignore ");
  });

  it("codepoints length", function() {
    let cow="big 🐄";
    assert(cow.length===6);
    
    function lengthCp(str){
      return [...str].length;
    }
    assert(lengthCp(cow)===5);
  });

/* Play with other APIs
construct 
  String.prototype.constructor()
  String.raw()
  String.fromCharCode()
  String.fromCodePoint()
  
  String.prototype.concat()
  String.prototype.repeat(count)
  
iterate 
  String.prototype.length
  String.prototype.charAt(index)
  String.prototype.charCodeAt(index)
  String.prototype[@@iterator]
  String.prototype.codePointAt()
  
test and search 
  String.prototype.indexOf(searchValue[, fromIndex])
  String.prototype.lastIndexOf(searchValue[, fromIndex])
  String.prototype.includes(searchString[, position])
  String.prototype.startsWith()
  String.prototype.endsWith()
  String.prototype.match(regexp)
  String.prototype.search(regexp)
  String.prototype.localeCompare()
  
extract 
  String.prototype.substring(indexStart[, indexEnd])
  String.prototype.slice(beginIndex[, endIndex)
  String.prototype.substr()
  
modify  
  String.prototype.split([separator[, limit]])
  String.prototype.replace(regexp|substr, newSubstr|function
  String.prototype.padEnd()
  String.prototype.padStart()
  String.prototype.trim()
  String.prototype.trimLeft()
  String.prototype.trimRight()
  String.prototype.trimStart()
  String.prototype.trimEnd()
  
convert 
  String.prototype.toLowerCase()
  String.prototype.toUpperCase()
  String.prototype.toLocaleLowerCase()
  String.prototype.toLocaleUpperCase()
  String.prototype.normalize([form])
  String.prototype.valueOf()
  String.prototype.toString()
*/
});