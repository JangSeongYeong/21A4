const urlParams = new URLSearchParams(window.location.search);
const ipAddress = urlParams.get('ip');


const url = `ws://${ipAddress}:8766`;  // 파이썬 웹 소켓 주소
const ws8766 = new WebSocket(url);

ws8766.onopen = function () {
    console.log("WebSocket is connected.");
};

ws8766.onmessage = function (event) {
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

ws8766.onerror = function (error) {
    console.error("WebSocket Error: ", error);
};