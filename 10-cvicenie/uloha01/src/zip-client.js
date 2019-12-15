const fs = require('fs')
const http = require('http')
const path = require('path')
const { pipeline } = require('stream');
const argv = require('minimist')(process.argv.slice(2));

if(argv['h']){
    console.log(
        `----------------------------------------------------
-i filename.                inputFile: path to the input file
                            Can be passed as first arg,
                            without switcher.
-o --output filename:       specified output file.
                            Path must be absolute
-h:                         Print Help
----------------------------------------------------` )
    process.exit(0)
}

let [ input_file ] = argv._
input_file = argv['i'] || argv['input-file'] || input_file

if( input_file == null ) {
    console.error({ message: 'No input file specified'})
    process.exit(1)
}

const output_file = argv['output-file'] || argv['o']
const outputStream = output_file != null ? fs.createWriteStream(output_file) : process.stdout

const url = "http://localhost:8080";
const request = http.request(url, {
        method: "POST"
})

request.on("response", (res) => {
        if(res.statusCode !== 200){
            console.error({message: 'Error on server side', response: res.statusMessage})
            process.exit(1)
        }
        res.pipe(outputStream)
        .on('error', console.error)
    })

request.setHeader('file-name', path.basename(input_file))

pipeline(
    fs.createReadStream( input_file, {encoding:'utf-8'} ),
    request,
    err => {
        if(err){
            console.error({ message: 'Error when sending to server!', error: err})
            process.exit(1)
        }
        else{
            console.log('File sent to server!')
        }
    }
)