const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");

function initializeApi(userDataManager, globalSettings, port = 8989) {
  const app = express();
  const server = http.createServer(app);

  server.listen(port, "0.0.0.0", () => {
    const localUrl = `http://localhost:${port}`;
    console.log(`Server started at ${localUrl}.`);
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "..", "public")));

  app.get("/icon.png", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "public", "icon.png"));
  });

  app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "public", "icon.ico"));
  });

  app.get("/api/data", (req, res) => {
    res.json({
      code: 0,
      user: userDataManager.getAllUsersData(),
    });
  });

  app.get("/api/enemies", (req, res) => {
    res.json({
      code: 0,
      enemy: userDataManager.getAllEnemiesData(),
    });
  });

  app.get("/api/clear", (req, res) => {
    userDataManager.clearAll(globalSettings);
    res.json({
      code: 0,
      msg: "Statistics cleared!",
    });
  });

  return server;
}

module.exports = initializeApi;
