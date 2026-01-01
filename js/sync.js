window.addEventListener("online", sincronizar);

function sincronizar() {
  const tx = db.transaction("pendientes", "readwrite");
  const store = tx.objectStore("pendientes");

  store.getAll().onsuccess = e => {
    e.target.result.forEach((item, index) => {
      enviarServidor(item);
      store.delete(index + 1);
    });
  };
}
