import { fork } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDevelopment = process.env.NODE_ENV === "development";

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

  if (isDevelopment) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  return win;
}

function handleServerData(rawData, window, url) {
  const data = rawData.toString();

  const noNpcap = data.match(/Npcap not detected/);
  if (noNpcap) return window.webContents.send("on-error", "Npcap not detected");

  const isReady = data.match(/Game server detected/);
  if (isReady) return window.webContents.send("on-ready", url);

  const uid = data.match(/Got player UUID! UUID: \d* UID: (\d+)/)?.at(1);
  if (uid) return window.webContents.send("on-uid", uid);
}

function createServer(window, serverPort = 8989) {
  let serverPath = path.join(__dirname, "../server/server.js");

  const server = fork(serverPath, [serverPort], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
    execArgv: [],
  });

  const url = `http://localhost:${serverPort}`;
  server.stdout.on("data", (data) => {
    if (isDevelopment) console.log(data.toString());
    handleServerData(data, window, url);
  });

  server.stderr.on("data", (data) => {
    console.error(`[server error] ${data}`);
  });

  server.on("exit", (code) => {
    console.log(`Server process exited with code ${code}`);
    try {
      window.webContents.send(
        "on-error",
        `Could not launch server. Code: ${code}`
      );
    } catch (err) {}
  });

  return server;
}

async function main() {
  if (window) return;
  window = createWindow();
  server = createServer(window);

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
