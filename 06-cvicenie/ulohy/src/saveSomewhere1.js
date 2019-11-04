const async = require("async");
 const fs = require("fs");
 module.exports = saveSomewhere;

function saveSomewhere(paths, data, cb) {

let tasks1 = paths.map(p => function(callback){
    fs.writeFile(p, data, err => { callback(err, p) });
});

async.tryEach(tasks1, cb);
}

/*
function saveSomewhere(paths, data, cb) {
  const tasks = paths.map( path => function(callback){
    try{
     fs.writeFile(path, data, (err) => {
       return callback(err, path)
     })
    }
    catch(err){
      return callback(err, path)
    }  
  })
  async.tryEach(tasks, cb);
}
*/