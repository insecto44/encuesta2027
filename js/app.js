document.addEventListener("DOMContentLoaded", async () => {

  const fform = document.getElementById("fform");
  const statusDiv = document.getElementById("status");

  if (!fform || !statusDiv) {
    console.error("Formulario o status no encontrado");
    return;
  }

  const URL = "https://script.google.com/macros/s/AKfycbyDiSQnhBIip-eQJ2M676M0T5-nHKkidC_srAHFVR7f41eKCLhyQYgH2Y3xNA6HT6BXrA/exec";

  /* ================= DB ================= */
  await window.openDB();

  function updateStatus() {
    statusDiv.textContent = navigator.onLine
      ? "🟢 Conectado"
      : "🔴 Sin conexión, guardando localmente";
  }

  updateStatus();
  window.addEventListener("online", sendPendingRecords);
  window.addEventListener("offline", updateStatus);

  /* ================= SYNC ================= */
  async function sendPendingRecords() {
    const records = await getAllRecords();

    if (!records.length) return;

    statusDiv.textContent = "🔄 Enviando datos pendientes...";

    for (const rec of records) {
      try {
        await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(rec)
        });
      } catch (err) {
        console.error("Error al enviar registro pendiente", err);
        statusDiv.textContent = "❌ Error al sincronizar";
        return;
      }
    }

    await clearAllRecords();
    statusDiv.textContent = "✅ Datos sincronizados correctamente";
  }

  /* ================= SUBMIT ================= */
  fform.addEventListener("submit", async (e) => {
    e.preventDefault();

    let data = Object.fromEntries(new FormData(fform));

    // Datos globales
    data.ineAnverso = window.ineAnverso || "";
    data.ineReverso = window.ineReverso || "";
    data.lat = fform.lat.value || "";
    data.lng = fform.lng.value || "";
    data.fechaRegistro = new Date().toISOString();

    // Validación mínima
    if (!data.lat || !data.lng) {
      alert("Selecciona la ubicación en el mapa");
      return;
    }

    // Convertir a MAYÚSCULAS
    Object.keys(data).forEach(k => {
      if (typeof data[k] === "string") {
        data[k] = data[k].toUpperCase();
      }
    });

    try {
      if (navigator.onLine) {

        await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        alert("Datos enviados correctamente ✔");

      } else {

        await addRecord(data);
        alert("Sin internet: datos guardados localmente ✔");

      }

      reiniciarAppSilencioso();

    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar datos");
    }
  });

});

/* =================================================
   🔄 REINICIO SILENCIOSO DE LA APP
================================================= */
function reiniciarAppSilencioso() {

  const form = document.getElementById("fform");
  const status = document.getElementById("status");

  if (!form) return;

  // Reset formulario
  form.reset();

  // Limpiar lat / lng
  if (form.lat) form.lat.value = "";
  if (form.lng) form.lng.value = "";

  // Limpiar variables globales
  window.ineAnverso = "";
  window.ineReverso = "";

  // Limpiar mapa
  if (window.map && window.marker) {
    window.map.removeLayer(window.marker);
    window.marker = null;
  }

  if (window.map && window.accuracyCircle) {
    window.map.removeLayer(window.accuracyCircle);
    window.accuracyCircle = null;
  }

  // Volver mapa a vista inicial
  if (window.map) {
    window.map.setView([19.845, -90.523], 13);
  }

  // Limpiar canvas INE
  const canvas = document.getElementById("canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
  }

  // Limpiar mensaje
  if (status) status.textContent = "";

  console.log("✔ App reiniciada de forma silenciosa");
}
