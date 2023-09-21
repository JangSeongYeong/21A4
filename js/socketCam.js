const cam1 = document.querySelector("#cam1");
const cam2 = document.querySelector("#cam2");

const urlParams = new URLSearchParams(window.location.search);
const ipAddress = urlParams.get('ip');

const ws8765 = new WebSocket(`ws://${ipAddress}:8765`);

ws8765.onopen = function () {
    console.log("WebSocket is connected 8765.");
};

ws8765.onmessage = function (event) {
    const frameData = event.data.split(";");
    if (frameData.length === 2) {
        const img1 = new Image();
        img1.src = "data:image/jpeg;base64," + frameData[0];
        cam1.src = img1.src;

        const img2 = new Image();
        img2.src = "data:image/jpeg;base64," + frameData[1];
        cam2.src = img2.src;
    }
};

ws8765.onerror = function (error) {
    console.error("WebSocket Error: ", error);
};