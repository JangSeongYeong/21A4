// ~Btn과 Modal은 modalControl에서 선언
const cam1 = document.querySelector("#cam1");   // 영상 표시용 1
const cam2 = document.querySelector("#cam2");   // 영상 표시용 2
const camera1 = document.querySelector(".camera1"); // 영상과 위치 text div 1
const camera2 = document.querySelector(".camera2"); // 영상과 위치 text div 2

// class hidden을 위한 상수 선언
const HIDDEN_CLASSNAME = "hidden";

let focusCamValue = "0";    // 확대 되어있는 카메라 위치 값 (1 or 2)
let crashValue = false;     // 신호 2개를 받았을 때 생성되는 버튼을 누르면 True - cam확대 조작

// Hader를 통한 IP값 읽어오기
const urlParams = new URLSearchParams(window.location.search);
const ipAddress = urlParams.get('ip');

// 특정 태그의 hidden class 제거 함수
function removeHidden(element) {
    element.classList.remove(HIDDEN_CLASSNAME);
}
// 특정 태그의 hidden class 추가 함수
function addHidden(element) {
    element.classList.add(HIDDEN_CLASSNAME);
}

// 화면 전환 함수
function changeCam(outCam, receivedData, reportBtn){
    focusCamValue = receivedData;
    addHidden(outCam);          // 신호가 들어온 화면 확대를 위하여 다른 카메라에 hidden 추가
    openModal(receivedData);    // modal open (receiveData번 카메라 위치에서 신호가 들어왔습니다.)
    removeHidden(reportBtn);    // 다른 카메라에 해당하는 신고버튼 숨기기
}

// 화면 초기화 (hidden을 둘다 제거함)
function resetCam(){
    if(camera1.classList[1]){
        removeHidden(camera1);    
    } else if (camera2.classList[1]){
        removeHidden(camera2);
    }
}


// --------------------------------------------------------
// ---------------- 웹 소켓 관련 코드 -----------------------
// --------------------------------------------------------

// WebSocket 8765번 연결: 영상 전용 소켓
const ws8765 = new WebSocket(`ws://${ipAddress}:8765`);

// 연결 성공
ws8765.onopen = function () {
    console.log("WebSocket is connected 8765.");
}
// 메시지를 수신할 때마다 실행
ws8765.onmessage = function (event) {
    const frameData = event.data.split(";"); // 1.cam + ";" + 2.cam의 데이터를 받고 나누기
    if (frameData.length === 2) {
        const img1 = new Image();
        img1.src = "data:image/jpeg;base64," + frameData[0];
        cam1.src = img1.src;

        const img2 = new Image();
        img2.src = "data:image/jpeg;base64," + frameData[1];
        cam2.src = img2.src;
    }
}
// 에러 발생 시 실행
ws8765.onerror = function (error) {
    console.error("WebSocket Error: ", error);
}


// WebSocket 8766번 연결: 데이터 수신 전용 소켓
const ws8766 = new WebSocket(`ws://${ipAddress}:8766`);

ws8766.onopen = function () {
    console.log("WebSocket is connected 8766.");
}
ws8766.onmessage = (event) => {
    const receivedData = event.data;
    // crashValue는 crashBtn(특정 캠이 확대되었을때 다른 신호가 들어오면 발생)을 click시 True로 변경되어 cam확대 방지
    if(crashValue === false){ 
        // 신호가 들어와있는 상태에서 다른 신호가 들어오면 버튼 생성
        if ((focusCamValue !== "0") && (focusCamValue !== receivedData) && (receivedData !== "0")){
            removeHidden(crashBtn);
        }
        // 1번 신호가 들어오면 1번 화면 확대(다른 카메라가 확대중일시 작동X)
        if (receivedData === "1" && focusCamValue !== "2") {             
            changeCam(camera2,receivedData,reportBtn1);
            }
        // 2번 신호가 들어오면 2번 화면 확대(다른 카메라가 확대중일시 작동X)
        else if (receivedData === "2" && focusCamValue !== "1") {     
            changeCam(camera1,receivedData,reportBtn2);
        }
        
    }
}

ws8766.onerror = function (error) {
    console.error("WebSocket Error: ", error);
}