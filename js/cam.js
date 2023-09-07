const webcamElement1 = document.getElementById('webcam1');
const webcamElement2 = document.getElementById('webcam2');

// 첫번째 카메라 시작 함수
async function startCamera1() {
const constraints = { video: { facingMode: 'user' } };
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        webcamElement1.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera 1:', error);
    }
}

// 두번째 카메라 시작 함수
async function startCamera2() {
    const constraints = { video: { facingMode: 'environment' } };
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        webcamElement2.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera 2:', error);
    }
}

// 카메라 모두 실행
startCamera1();
startCamera2();