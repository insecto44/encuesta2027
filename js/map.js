document.addEventListener("DOMContentLoaded", () => {

  const mapDiv = document.getElementById("map");
  const geoBtn = document.getElementById("geoBtn");
  const form = document.getElementById("fform");

  if (!mapDiv || !geoBtn || !form) {
    console.error("Elementos del DOM no encontrados");
    return;
  }

  /* ===== CREAR MAPA ===== */
  const map = L.map("map").setView([19.845, -90.523], 13);
  let marker = null;
  let accuracyCircle = null;

  // 🔹 HACER GLOBALES
  window.map = map;
  window.marker = null;
  window.accuracyCircle = null;
  window.lat = "";
  window.lng = "";

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  /* ===== FUNCIÓN CENTRAL ÚNICA ===== */
  function setMarker(lat, lng, accuracy = null) {

    if (marker) map.removeLayer(marker);
    if (accuracyCircle) map.removeLayer(accuracyCircle);

    marker = L.marker([lat, lng]).addTo(map);
    window.marker = marker;

    if (accuracy) {
      accuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: "blue",
        fillOpacity: 0.15
      }).addTo(map);
      window.accuracyCircle = accuracyCircle;
    }

    // 🔥 CLAVE: sincronizar TODO
    form.lat.value = lat;
    form.lng.value = lng;
    window.lat = lat;
    window.lng = lng;

    console.log("Ubicación guardada:", lat, lng);
  }

  /* ===== CLICK MANUAL ===== */
  map.on("click", e => {
    setMarker(e.latlng.lat, e.latlng.lng);
    map.setView([e.latlng.lat, e.latlng.lng], 18);
  });

  /* ===== GEOLOCALIZACIÓN ===== */
  geoBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
      alert("Geolocalización no soportada");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;

        setMarker(latitude, longitude, accuracy);
        map.setView([latitude, longitude], 18);

        if (accuracy > 20) {
          alert(
            `Ubicación APROXIMADA (${Math.round(accuracy)} m).\n` +
            `Ajusta manualmente tocando el mapa.`
          );
        }
      },
      err => alert("Error GPS: " + err.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  });

});
