const inputdata = document.querySelector("#inputdata");
const webcam1 = document.querySelector("#cam1");
const webcam2 = document.querySelector("#cam2");

const HIDDEN_CLASSNAME = "hidden";

function setWebcamSize(cam, size) {
    cam.style.width = size;
}

function resetWebcam() {
    setWebcamSize(webcam1, "50%");
    setWebcamSize(webcam2, "50%");
    webcam1.classList.remove(HIDDEN_CLASSNAME);
    webcam2.classList.remove(HIDDEN_CLASSNAME);
}

const socket = new WebSocket('ws://172.16.6.59:8766');

    socket.onopen = function () {
    console.log("WebSocket is connected.");
    resetWebcam();
    };

    socket.onmessage = (event) => {
        const Data = event.data
        if (Data == "1") {
            setWebcamSize(webcam1, "100%");
            webcam2.classList.add(HIDDEN_CLASSNAME);
            console.log("cam1");
        } else if (Data == "2") {
            setWebcamSize(webcam2, "100%");
            webcam1.classList.add(HIDDEN_CLASSNAME);
            console.log("cam2");
        }
    };

    socket.onerror = function (error) {
        console.error("WebSocket Error: ", error);
    };