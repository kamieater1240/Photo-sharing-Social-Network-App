// import the db interactions module
const dbLib = require('./dbFunctions')
const app = require('./index')
const { createServer } = require("http");
const url = require('url');
const WebSocket = require("ws");
const uploadModule = require("./upload")
var clients = uploadModule.clients;

// define the port
const port = process.env.PORT || 8080;
const server = createServer(app);
// declare a db reference variable
let db;

server.listen(port, async () => {
    db = await dbLib.connect();
    console.log(`Server runnning on port: ${port}`);
});

const wss = new WebSocket.Server({ path: "/ws", server });

wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4(); 
}

wss.on("connection", (ws, req) => {
    const parameters = url.parse(req.url, true);
    // console.log(user);
    var userId = parameters.query.userId

    clients[userId] = ws;
    // clients.add({key: userId, value: ws});
    ws.on('close', () => {
        delete clients[userId];
    })
})

module.exports = {server, wss}

