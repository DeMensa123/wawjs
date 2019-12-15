const path = require('path')
const http = require('http')
const fs = require('fs')
const { pipeline } = require('stream')
const { createGzip} = require('zlib')

const storageDir = path.join(__dirname, 'outputs')

const server = http.createServer()

server.listen(8080, "localhost").on("request", (req, res) => {

    const storage_file = path.join(storage_dir, `${new Date().getTime()}-${req.headers['file-name']}` )

    pipeline(
        req,
        fs.createWriteStream(storage_file),
        (err) => {
            if(err) {
                console.error(err)
                res.statusCode = 500;
                res.statusMessage = 'Internal Server Error'
                res.end()
                process.exit(1)
            }
            else{
                pipeline(
                    req,
                    createGzip(),
                    res,
                    err => {
                        if(err){
                            console.error({ message: 'Error, terminating!', error: err})
                            res.statusCode = 500;
                            res.statusMessage = 'Internal Server Error'
                            res.end()
                            process.exit(1)
                        }
                        else{
                            console.log('Job finished!')
                        }
                    }
                )
            }
        }
    )
  });