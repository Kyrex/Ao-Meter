const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  closeWindow: () => ipcRenderer.send("window-close"),
  moveWindow: (pos) => ipcRenderer.send("window-move", pos),
  resizeWindow: (size) => ipcRenderer.send("window-resize", size),
  //
  onUid: (fn) => ipcRenderer.on("on-uid", (_, uid) => fn(uid)),
  offUid: (fn) => ipcRenderer.removeListener("on-uid", (_, uid) => fn(uid)),
  onError: (fn) => ipcRenderer.on("on-error", (_, err) => fn(err)),
  offError: (fn) => ipcRenderer.removeListener("on-error", (_, err) => fn(err)),
  onReady: (fn) => ipcRenderer.on("on-ready", (_, url) => fn(url)),
  offReady: (fn) => ipcRenderer.removeListener("on-ready", (_, url) => fn(url)),
  onMoved: (fn) => ipcRenderer.on("on-move", (_, pos) => fn(pos)),
  offMoved: (fn) => ipcRenderer.removeListener("on-move", (_, pos) => fn(pos)),
  onLock: (fn) => ipcRenderer.on("on-lock", (_, locked) => fn(locked)),
  offLock: (fn) => ipcRenderer.removeListener("on-ready", (_, url) => fn(url)),
});
