const assert = require("assert");
const server = require('../src/zip-server');
const client = require('../src/zip-client');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const port = 8080;
const file = `${__dirname}/testfile.bin`;
const dir = `${__dirname}/testdir`;

let srv;

describe("Zipper Tests", () => {

    it("Server is unreachable", () => {

        client(port, file).on('close', () => {
            assert(!fs.existsSync(`${__dirname}/${path.parse(file).base}.gz`));
        });

    });

    it("File is correctly sent", () => {

        srv = server(dir).listen(port);

        client(port, file).on('finish', ()=>{
            srv.close();
        });

        srv.on('close', () => {
            const f1 = fs.readFileSync(file);
            const f2 = fs.readFileSync(`${dir}/testfile.bin`);

            const h1 = crypto.createHash('sha1').update(f1).digest().toString();
            const h2 = crypto.createHash('sha1').update(f2).digest().toString();

            assert(h1 == h2);

            fs.unlinkSync(`${dir}/testfile.bin`);
            fs.unlinkSync(`${__dirname}/${path.parse(file).base}.gz`);
        });
    });

    it("Client disconnect", () => {

        srv.close();
        srv = server(dir).listen(port);

        let clt = client(port, file).on('finish', ()=>{
            srv.close();
        });
        let count = 0;

        clt.on('data', ()=>{
            if (count++ < 3) {
                clt.destroy();
            }
        })

        srv.on('close', () => {
            assert(!fs.existsSync(`${__dirname}/${path.parse(file).base}.gz`));
            assert(!fs.existsSync(`${dir}/testfile.bin`));
        });
    });
});