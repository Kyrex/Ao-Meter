import { fork } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let window, server;
let isLocked = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "../public/icon.ico"),
  });

  function lockWindow(lock) {
    isLocked = lock;
    win.setMovable(!isLocked);
    win.setAlwaysOnTop(true, "screen-saver");
    if (isLocked) {
      win.setIgnoreMouseEvents(true, { forward: true });
    } else {
      win.setIgnoreMouseEvents(false);
    }
    win.webContents.send("on-lock", isLocked);
  }

  ipcMain.handle("window-args", () => process.argv);
  ipcMain.on("window-close", (_) => win.close());
  ipcMain.on("window-move", (_, pos) => win.setPosition(pos.x, pos.y));
  ipcMain.on("window-resize", (_, res) => {
    win.setMinimumSize(100, 50);
    win.setSize(res.w, res.h);
  });
  win.on("focus", () => lockWindow(false));
  win.on("blur", () => lockWindow(true));
  win.addListener("moved", () => {
    const [x, y] = win.getPosition();
    win.webContents.send("on-move", { x: x, y: y });
  });
  win.webContents.on("did-finish-load", () => {
    const [x, y] = win.getPosition();
    win.webContents.send("on-move", { x: x, y: y });
    win.webContents.send("on-lock", isLocked);
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  return win;
}

function createServer(onReady, serverPort = 8989) {
  let serverPath = path.join(__dirname, "../server/server.js");

  const server = fork(serverPath, [serverPort], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
    execArgv: [],
  });

  server.stdout.on("data", (data) => {
    console.log(`[server] ${data}`);
    if (data.toString().startsWith("Game server detected")) {
      onReady(`http://localhost:${serverPort}`);
    }
  });

  server.stderr.on("data", (data) => {
    console.error(`[server error] ${data}`);
  });

  server.on("exit", (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  return server;
}

async function main() {
  if (window) return;
  window = createWindow();
  server = createServer((url) => window.webContents.send("on-ready", url));

  window.on("closed", () => {
    if (!server) return;
    server.kill("SIGTERM");
    setTimeout(() => {
      if (!server.killed) {
        server.kill("SIGKILL");
      }
    }, 5000);
  });
}

app.whenReady().then(main);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) main();
});
