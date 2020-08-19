const sls = require('serverless-http');
const binaryMimeTypes = require('./binaryMimeTypes');

const server = require('./server');
console.log(server);
console.log(typeof server.handle);
module.exports.server = sls(server, { binary: binaryMimeTypes });
