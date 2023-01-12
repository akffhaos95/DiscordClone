const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute") 
const cameraBtn = document.getElementById("camera")
const camerasSelect = document.getElementById("cameras")

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option")
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label == camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstraing = {
        audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraing
        )
        myFace.srcObject = myStream;
        if (!deviceId) {
            await getCameras();
        }
        console.log(myStream)
    } catch (e) {
        console.log(e);
    }
}

getMedia();

muteBtn.addEventListener("click", () => {
    if (!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
});
cameraBtn.addEventListener("click", () => {
    if (cameraOff) {
        cameraBtn.innerText = "Trun Camera Off"
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Trun Camera On"
        cameraOff = true;
    }
});

camerasSelect.addEventListener("input", async () => {
    await getMedia(camerasSelect.value);
})