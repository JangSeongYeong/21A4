const inputdata = document.querySelector("#inputdata");
const webcam1 = document.querySelector("#cam1");
const webcam2 = document.querySelector("#cam2");

const HIDDEN_CLASSNAME = "hidden";

function setWebcamSize(cam, size) {
    cam.style.width = size;
}

function resetWebcam() {
    setWebcamSize(webcam1, "50%");
    setWebcamSize(webcam2, "50%");
    webcam1.classList.remove(HIDDEN_CLASSNAME);
    webcam2.classList.remove(HIDDEN_CLASSNAME);
}

inputdata.addEventListener("input", () => {
    resetWebcam();
    
    if (inputdata.value === "1") {
        setWebcamSize(webcam1, "100%");
        webcam2.classList.add(HIDDEN_CLASSNAME);
        console.log("cam1");
    } else if (inputdata.value === "2") {
        setWebcamSize(webcam2, "100%");
        webcam1.classList.add(HIDDEN_CLASSNAME);
        console.log("cam2");
    }
});
