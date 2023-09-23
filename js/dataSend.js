const clearBtn = document.querySelector("#clearBtn");
const modal = document.querySelector("#myModal");
const reportBtn = document.querySelector("#reportBtn");

/*
socketData에 urlParams, ipAddress가 선언되어있어 선언할 필요 없음
같은 html안에 자바스크립트를 넣는 것이기 때문에 
<script>안에 둘다 들어간다고 생각하면 같은 객체가 겹치거나 같은 변수를 사용해서는 안됨
*/
function openModal(cameraNumber) {
    modal.classList.remove(HIDDEN_CLASSNAME);
    const modalContent = document.querySelector("#myModal .modal-content p");
    modalContent.innerText = `${cameraNumber}번 카메라 위치에서 신호가 들어왔습니다.`;
}

function closeModal() {
    modal.classList.add(HIDDEN_CLASSNAME);
    crashBtn.classList.add(HIDDEN_CLASSNAME); // 데이터 충돌 시에 작업
    resetWebcam()
    sData = "0";
}

const ws8767 = new WebSocket(`ws://${ipAddress}:8767`);

clearBtn.addEventListener("click", () => {
    const message = "clear";
    closeModal();
    ws8767.send(message);
});

reportBtn.addEventListener("click", () => {
    if(confirm("신고하시겠습니까?")){
        alert(`신고되었습니다.`)
        closeModal();
    }
})

ws8767.onopen = function () {
    console.log("WebSocket is connected 8767.");
};

ws8767.onerror = function (error) {
    console.error("WebSocket Error: ", error);
};