const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  windowArgs: async () => await ipcRenderer.invoke("window-args"),
  closeWindow: () => ipcRenderer.send("window-close"),
  moveWindow: (pos) => ipcRenderer.send("window-move", pos),
  resizeWindow: (size) => ipcRenderer.send("window-resize", size),
  //
  onReady: (fn) => ipcRenderer.on("on-ready", (_, url) => fn(url)),
  offReady: (fn) => ipcRenderer.removeListener("on-ready", (_, url) => fn(url)),
  onMoved: (fn) => ipcRenderer.on("on-move", (_, pos) => fn(pos)),
  offMoved: (fn) => ipcRenderer.removeListener("on-move", (_, pos) => fn(pos)),
  onLock: (fn) => ipcRenderer.on("on-lock", (_, locked) => fn(locked)),
  offLock: (fn) => ipcRenderer.removeListener("on-ready", (_, url) => fn(url)),
});
