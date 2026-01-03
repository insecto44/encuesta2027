let paso = "anverso";

document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const titulo = document.getElementById("titulo");
  const btn = document.getElementById("btn");

  if (!video || !canvas || !btn || !titulo) {
    console.error("Elementos de cámara no encontrados");
    return;
  }

  iniciarCamara();

  btn.addEventListener("click", capturar);

  /* ================================
     🎥 INICIAR CÁMARA
  ================================ */
  async function iniciarCamara() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      video.srcObject = stream;
    } catch (e) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      video.srcObject = stream;
    }
  }

  /* ================================
     📸 CAPTURA
  ================================ */
  function capturar() {

    // Proporción INE horizontal
    canvas.width = 420;
    canvas.height = 270;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = canvas.toDataURL("image/jpeg", 0.9);

    if (paso === "anverso") {
      localStorage.setItem("ineAnverso", img);
      paso = "reverso";
      titulo.textContent = "INE – REVERSO";
      alert("Ahora captura el REVERSO");
    } else {
      localStorage.setItem("ineReverso", img);
      detenerCamara();
      window.location.href = "index.html";
    }
  }

  function detenerCamara() {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
    }
  }

});
