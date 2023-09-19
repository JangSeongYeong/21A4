const inputdata = document.getElementById('inputdata');
        const socket = new WebSocket('ws://172.16.6.59:8765');

        socket.addEventListener('open', (event) => {
            console.log('WebSocket connected');
        });

        // inputdata 값이 변경될 때마다 해당 값을 서버로 전송
        inputdata.addEventListener('input', () => {
            const value = inputdata.value;
            socket.send(value);
            console.log('Sent message:', value);
        });