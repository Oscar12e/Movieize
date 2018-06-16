const http = require('http');
const app = require('./app');

var PORT_NUMBER = 8000;
const port = process.env.PORT || PORT_NUMBER;

const server = http.createServer(app);

server.listen(port);
console.log("Listening on port "+PORT_NUMBER)