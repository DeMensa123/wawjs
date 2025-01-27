const fs = require("fs").promises;
const path = require("path")

module.exports = lsRescursive

async function lsRescursive(dirName) {

  
  const filtered_list = dirsOnly(await ls(dirName))
  
  const fullPaths = filtered_list.map(({name}) => path.resolve(dirName,name))

  const allDone = fullPaths.map(ls)

  const output = await Promise.all(allDone
    )
  const files = [].concat(...output)
  return filesOnly(files).map(({name}) => name)
  /*
  return ls(dirName)
<<<<<<< HEAD
    .then(dirsOnly)
    .then(dirs => dirs.map(({ name }) => name))
    .then(dirs => dirs.map(name => path.resolve(dirName, name)))
    .then(dirs => dirs.map(ls)) // [] of Promises of []s
    .then(files => Promise.all(files)) // Promise of [] of []s
    .then(files => [].concat(...files)) // [[],[],...]-> [.,.,.]
    .then(filesOnly)
    .then((files) =>
      files.map(({ name }) => name)
    )
    */
=======
    // .then(dirsOnly)
    // .then(dirs => dirs.map(({ name }) => name))
    // .then(dirs => dirs.map(name => path.resolve(dirName, name)))
    // .then(dirs => dirs.map(ls)) // [] of Promises of []s
    // .then(files => Promise.all(files)) // Promise of [] of []s
    // .then(files => [].concat(...files)) // [[],[],...]-> [.,.,.]
    // .then(filesOnly)
    // .then((files) =>
    //   files.map(({ name }) => name)
    // )
>>>>>>> a470c3efde5ae31cb529335cac2c29fbc4c87a89
}

function ls(dirName) {
  return fs.readdir(dirName, {
    withFileTypes: true
  });
}

function dirsOnly(files) {
  return files.filter((f) => f.isDirectory());
}

function filesOnly(files) {
  return files.filter((f) => f.isFile());
}

