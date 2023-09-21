const clearBtn = document.querySelector("#clearBtn");
const modal = document.querySelector("#myModal");

/*
socketData에 urlParams, ipAddress가 선언되어있어 선언할 필요 없음
같은 html안에 자바스크립트를 넣는 것이기 때문에 
<script>안에 둘다 들어간다고 생각하면 같은 객체가 겹치거나 같은 변수를 사용해서는 안됨
*/
function openModal() {
    modal.classList.remove(HIDDEN_CLASSNAME);
}

function closeModal() {
    modal.classList.add(HIDDEN_CLASSNAME);
    resetWebcam()
}

const ws8767 = new WebSocket(`ws://${ipAddress}:8767`);

clearBtn.addEventListener("click", () => {
    const message = "해제";
    closeModal();
    ws8767.send(message);
});

ws8767.onopen = function () {
    console.log("WebSocket is connected 8767.");
};

ws8767.onerror = function (error) {
    console.error("WebSocket Error: ", error);
};