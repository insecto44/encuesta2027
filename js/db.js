const DB_NAME = "CampañaDB";
const DB_VERSION = 1;
const STORE_NAME = "registros";

window.db = window.db || null

window.openDB = function() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CampañaDB", 1);

    request.onerror = () => reject("Error al abrir DB");
    request.onsuccess = () => {
      window.db = request.result;
      resolve(window.db);
    };
    request.onupgradeneeded = (e) => {
      window.db = e.target.result;
      if(!window.db.objectStoreNames.contains(STORE_NAME)){
        window.db.createObjectStore(STORE_NAME, { autoIncrement: true });
      }
    };
  });
}

function addRecord(data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.add(data);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject("Error al guardar registro");
  });
}

function getAllRecords() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al leer registros");
  });
}

function clearAllRecords() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject("Error al limpiar registros");
  });
}
