import http from "http"
import WebSocket from "ws";
import express from "express"

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "\\views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.reedirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", () => console.log("close to Brower"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg)
        switch(message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(
                    `${socket.nickname}: ${message.payload}`
                ));
            case "nickname":
                socket["nickname"] = message.payload;    
        }        
    });
});

server.listen(3000, () => console.log("Listening on localhost"));