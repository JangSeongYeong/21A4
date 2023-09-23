const clearBtn = document.querySelector("#clearBtn");
const modal = document.querySelector("#myModal");
const reportBtn = document.querySelector("#reportBtn");
const reportBtn1 = document.querySelector("#reportBtn1");
const reportBtn2 = document.querySelector("#reportBtn2");
const modalContent = document.querySelector("#myModal .modal-content p");

function openModal(cameraNumber) {
    modal.classList.remove(HIDDEN_CLASSNAME);
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
    CRASHCONTROL = false;
    ws8767.send(message);
});

reportBtn.addEventListener("click", () => {
    if(confirm("신고하시겠습니까?")){
        alert(`신고되었습니다.`)
        closeModal();
    }
})

reportBtn1.addEventListener("click", () => {
    if(confirm("1번 위치로 신고하시겠습니까?")){
        alert(`신고되었습니다.`)
        modal.classList.add(HIDDEN_CLASSNAME);
        sData = "0";
        CRASHCONTROL = false;
    }
})

reportBtn2.addEventListener("click", () => {
    if(confirm("2번 위치로 신고하시겠습니까?")){
        alert(`신고되었습니다.`)
        modal.classList.add(HIDDEN_CLASSNAME);
        sData = "0";
        CRASHCONTROL = false;
    }
})

ws8767.onopen = function () {
    console.log("WebSocket is connected 8767.");
};

ws8767.onerror = function (error) {
    console.error("WebSocket Error: ", error);
};