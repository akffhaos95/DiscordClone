const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const room = document.getElementById("room")
room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li")
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value
    socket.emit("nickname", input.value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const room = form.querySelector("#roomname");
    const name = form.querySelector("#name");
    socket.emit("enter_room", room.value, name.value, showRoom);
    roomName = room.value;
    room.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => addMessage(`${user} 들어왔햄`));
socket.on("bye", (user) => addMessage(`${user} 나갔햄`));
socket.on("new_message", addMessage)