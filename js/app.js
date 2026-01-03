/* =================================================
   🔎 DETECTAR ENTORNO (LOCALHOST / PRODUCCIÓN)
================================================= */
function isLocalhost() {
  return (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
  );
}

/* =================================================
   📤 ENVÍO INTELIGENTE (EVITA CORS)
================================================= */
async function enviarDatos(data) {
  const URL = "https://script.google.com/macros/s/AKfycbzk0WZDVD_L7hEnslwPp3Gn7NMHKe173K1PIxVMPnF9kGExF5Xn2XpGXrxJrsFM_2bpjA/exec";

  const options = isLocalhost()
    ? {
        method: "POST",
        body: JSON.stringify(data)
      }
    : {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

  const resp = await fetch(URL, options);
  if (!resp.ok) throw new Error("Error en envío");
  return resp.text();
}

/* =================================================
   🚀 APP PRINCIPAL
================================================= */
document.addEventListener("DOMContentLoaded", async () => {



  const fform = document.getElementById("fform");
  const statusDiv = document.getElementById("status");

  if (!fform || !statusDiv) {
    console.error("Formulario o status no encontrado");
    return;
  }

  /* ================= DB ================= */
  await window.openDB();

  function updateStatus() {
    statusDiv.textContent = navigator.onLine
      ? "🟢 Conectado"
      : "🔴 Sin conexión, guardando localmente";
  }

  updateStatus();
  window.addEventListener("online", enviarPendientes);
  window.addEventListener("offline", updateStatus);

  /* ================= SYNC ================= */
  async function enviarPendientes() {
    const records = await getAllRecords();
    if (!records.length) return;

    statusDiv.textContent = "🔄 Enviando datos pendientes...";

    for (const rec of records) {
      try {
        await enviarDatos(rec);
      } catch (err) {
        console.error("Error sincronizando:", err);
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
    data.lat = fform.lat?.value || "";
    data.lng = fform.lng?.value || "";
    data.fechaRegistro = new Date().toISOString();

    // Validación mínima
    if (!data.lat || !data.lng) {
      alert("Selecciona la ubicación en el mapa");
      return;
    }

    try {
      if (navigator.onLine) {
        await enviarDatos(data);
        statusDiv.textContent = "✅ Datos enviados";
      } else {
        await saveRecord(data);
        statusDiv.textContent = "💾 Guardado localmente (offline)";
      }
      fform.reset();
    } catch (err) {
      console.error(err);
      await saveRecord(data);
      statusDiv.textContent = "⚠️ Guardado local por error de red";
    }
  });

});
/* ================= CAMERA ================= */
document.getElementById("btnCamara").addEventListener("click", () => {

  const form = document.getElementById("fform");
  const data = Object.fromEntries(new FormData(form));

  // Guardar formulario temporalmente
  localStorage.setItem("formTemp", JSON.stringify(data));

  // Ir a la página de cámara
  window.location.href = "camera.html";
});
const temp = localStorage.getItem("formTemp");

if (temp) {
  const data = JSON.parse(temp);
  const form = document.getElementById("fform");

  Object.keys(data).forEach(name => {
    if (form.elements[name]) {
      form.elements[name].value = data[name];
    }
  });

  console.log("✔ Formulario restaurado");
}
localStorage.removeItem("formTemp");
localStorage.removeItem("ineAnverso");
localStorage.removeItem("ineReverso");
