import http from "http"
import SocketIO from "socket.io"
import express from "express"

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "\\views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));

const server = http.createServer(app);
const wsServer = SocketIO(server);

wsServer.on("connection", socket => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`)
    });

    socket.on("enter_room", (roomName, nickname, done) => {
        socket.join(roomName)
        socket["nickname"] = nickname
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket.nickname);
        });
    })

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}햄`)
        done();
    })

    socket.on("nickname", nickname => (socket["nickname"] = nickname))
})

server.listen(3000, () => console.log("Listening on localhost"));