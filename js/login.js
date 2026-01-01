const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbyDiSQnhBIip-eQJ2M676M0T5-nHKkidC_srAHFVR7f41eKCLhyQYgH2Y3xNA6HT6BXrA/exec";

document.addEventListener("DOMContentLoaded", () => {

  // ✅ SI YA HAY SESIÓN, ENTRA DIRECTO
  if (localStorage.getItem("logged") === "true") {
    location.replace("index.html");
    return;
  }

  // 📴 SIN INTERNET Y SIN SESIÓN → BLOQUEAR
  if (!navigator.onLine) {
    document.getElementById("error").textContent =
      "❌ No hay conexión. Debes iniciar sesión al menos una vez con internet.";
    return;
  }

  const form = document.getElementById("loginForm");
  const error = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(URL_SCRIPT, {
        method: "POST",
        body: JSON.stringify({
          action: "login",
          usuario,
          password
        })
      });

      const data = await res.json();

      if (data.success === true) {
        localStorage.setItem("logged", "true");
        localStorage.setItem("usuario", data.usuario);
        localStorage.setItem("loginTime", Date.now());

        location.replace("index.html");
      } else {
        error.textContent = "Usuario o contraseña incorrectos";
      }

    } catch (err) {
      console.error(err);
      error.textContent = "Error de conexión";
    }
  });

});
