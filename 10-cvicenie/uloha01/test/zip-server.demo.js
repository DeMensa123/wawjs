const { spawn } = require('child_process');
const path = require('path')

const server = spawn('node', [path.join(__dirname, '..','src', 'uloha01','zip-server.js')])
server.stdout.on('data', (data) => {
    console.log('STDOUT/server:', data.toString())
});
server.stderr.on('data', (data) => {
    console.log('STDERR/server:', data.toString())
});


const client = spawn('node', [
    path.join(__dirname, '..','src', 'zip-client.js'),
    path.join(__dirname, '..','src', 'test_file.txt'), 
    `--output-file=${path.join(__dirname, '..','src', 'pptx_archive.zip')}`
])
client.stdout.on('data', (data) => {
    console.log('STDOUT/client:', data.toString())
});
client.stderr.on('data', (data) => {
    console.log('STDERR/client:', data.toString())
});