document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("video");
  const btnCamara = document.getElementById("btnCamara");

  if (!video || !btnCamara) {
    console.error("Elementos de cámara no encontrados");
    return;
  }

  let stream = null;

  btnCamara.addEventListener("click", async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" }
        },
        audio: false
      });

      video.srcObject = stream;
      video.play();

    } catch (err) {
      alert("No se pudo acceder a la cámara");
      console.error(err);
    }
  });

});
