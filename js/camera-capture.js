const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const btn = document.getElementById("captureBtn");

let step = "ANVERSO";

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => {
  video.srcObject = stream;
});

btn.addEventListener("click", () => {

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const img = canvas.toDataURL("image/jpeg", 0.9);

  if (step === "ANVERSO") {
    localStorage.setItem("ineAnverso", img);
    step = "REVERSO";
    btn.textContent = "📸 Tomar REVERSO";
    alert("Ahora toma el REVERSO");
  } else {
    localStorage.setItem("ineReverso", img);

    video.srcObject.getTracks().forEach(t => t.stop());

    window.location.href = "index.html";
  }
});
