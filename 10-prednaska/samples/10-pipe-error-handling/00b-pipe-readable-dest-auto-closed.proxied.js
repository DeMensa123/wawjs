/*
Sample demonstruje spravanie pipe()
v pripade, ze readable failne
zaujima nas: co sa stane,
a v akom stave zostane readable, transforms a writable
*/

// TLDR; pipe zavrie dest stream ak vsecko bolo ok

// verzia z debugging proxy
const file = `${__dirname}/data/00.out`;
let dest = require("fs").createWriteStream(file)

const ReadableEnding = require("../mocks/ReadableEnding.js");
let source = new ReadableEnding(10);

const logging = require("../lib/loggingProxy.js");
source = logging("R", source);
dest = logging("W", dest);

source.pipe(dest);

/*
Output:
1. process skonci ked skoncia async tasky streamov
2. readable will be ended
3. writable will be closed

Doc:
By default, stream.end() is called on the destination Writable stream 
when the source Readable stream emits 'end', 
so that the destination is no longer writable. 

Order of key events:

W pipe +0ms
R resume +0ms
R end +0ms
R finished() +0ms
W finish +5ms
W finished() +0ms
W unpipe +0ms
W close +0ms

*/