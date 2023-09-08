const inputdata = document.querySelector("#inputdata");
const webcam1 = document.querySelector("#webcam1");
const webcam2 = document.querySelector("#webcam2");

HIDDEN_CLASSNAME = "hidden";


function setFullScreenSize() {
    webcam1.style.width = "100%";
    webcam2.style.width = "100%"; 
}

function resetWebcamSize() { 
    webcam1.style.width = "50%";
    webcam2.style.width = "50%";
}

// input에 대한 이벤트 설정
inputdata.addEventListener("input", () => {
    if(inputdata.value === "1") { 
        // "1" 입력시 1번 캠 확대
        setFullScreenSize();
        webcam2.classList.add(HIDDEN_CLASSNAME); //1번
        webcam1.classList.remove(HIDDEN_CLASSNAME);
        console.log("cam1"); //화면 전환 확인용 콘솔
    } else if (inputdata.value === "2") {
        // "2"입력시 2번 캠 확대
        setFullScreenSize(); 
        webcam1.classList.add(HIDDEN_CLASSNAME);
        webcam2.classList.remove(HIDDEN_CLASSNAME);
        console.log("cam2"); //화면 전환 확인용 콘솔
    } else {
        resetWebcamSize();
        webcam2.classList.remove(HIDDEN_CLASSNAME);
        webcam1.classList.remove(HIDDEN_CLASSNAME);
    }
});
