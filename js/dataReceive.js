const socket = new WebSocket('ws://172.16.6.59:8766');

    socket.onopen = function () {
    console.log("WebSocket is connected.");
    };

    socket.onmessage = (event) => {
        const Data = event.data
        console.log('Received data:', Data);
    };

    socket.onerror = function (error) {
        console.error("WebSocket Error: ", error);
    };