export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskDB", 2)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true })
      }
      if (!db.objectStoreNames.contains("projects")) {
        db.createObjectStore("projects", {
          autoIncrement: true,
        })
      }
    }
    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject("DB error: " + event.target.error)
  })
}

export async function saveTask(task) {
  const db = await openDB()
  const tx = db.transaction("tasks", "readwrite")
  const store = tx.objectStore("tasks")
  store.put(task)
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true)
    tx.onerror = (e) => reject(e)
  })
}

export async function loadTasks() {
  const db = await openDB()
  const tx = db.transaction("tasks", "readonly")
  const store = tx.objectStore("tasks")
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = (e) => reject(e)
  })
}

export async function deleteTask(taskId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("tasks", "readwrite")
    const store = tx.objectStore("tasks")
    const request = store.delete(taskId)

    request.onsuccess = () => resolve(true)
    request.onerror = (e) => reject(e)
  })
}

export async function saveNewProject(project) {
  const db = await openDB()
  const tx = db.transaction("projects", "readwrite")
  const store = tx.objectStore("projects")
  return new Promise((resolve, reject) => {
    const request = store.put(project)
    request.onsuccess = () => {
      console.log("Project saved:", project)
      resolve(true)
    }
    request.onerror = (e) => {
      console.error("Error saving project:", e)
      reject(e)
    }
  })
}

export async function loadProjects() {
  const db = await openDB()
  const tx = db.transaction("projects", "readonly")
  const store = tx.objectStore("projects")
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = (e) => reject(e)
  })
}
