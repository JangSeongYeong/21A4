const webcam1 = document.querySelector("#cam1");
const webcam2 = document.querySelector("#cam2");

/*
socketData에 urlParams, ipAddress가 선언되어있어 선언할 필요 없음
같은 html안에 자바스크립트를 넣는 것이기 때문에 
<script>안에 둘다 들어간다고 생각하면 같은 객체가 겹치거나 같은 변수를 사용해서는 안됨
*/
const url2 = `ws://${ipAddress}:8766`;

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

const ws8766 = new WebSocket(url2);

    ws8766.onopen = function () {
    console.log("WebSocket is connected.");
    resetWebcam();
    };

    ws8766.onmessage = (event) => {
        const Data = event.data
        if (Data === "1") {
            setWebcamSize(webcam1, "100%");
            webcam2.classList.add(HIDDEN_CLASSNAME);
            webcam1.classList.remove(HIDDEN_CLASSNAME);
            console.log("cam1");
        } else if (Data === "2") {
            setWebcamSize(webcam2, "100%");
            webcam1.classList.add(HIDDEN_CLASSNAME);
            webcam2.classList.remove(HIDDEN_CLASSNAME);
            console.log("cam2");
        }
    };

    ws8766.onerror = function (error) {
        console.error("WebSocket Error: ", error);
    };