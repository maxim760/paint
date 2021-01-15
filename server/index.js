const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);
const aWss = WSServer.getWss();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.ws("/", (ws, req) => {
  console.log("Подключение установлено");
  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "connection": {
        connectionHandler(ws, msg);
        break;
      }
      case "draw": {
        broadcastConnection(ws, msg);
        break;
      }
    }
  });
});

app.listen(PORT, () => {
  console.log("SERVER RUNNED on port " + PORT);
});

app.post("/image", (req, res) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, "");
    fs.writeFileSync(
      path.resolve(__dirname, "files", `${req.query.id}.jpg`),
      data,
      "base64"
    );
    return res.status(201).json({
      message: "Загружено",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
});

app.get("/image", (req, res) => {
  try {
    const pathToImg = path.resolve(__dirname, "files", `${req.query.id}.jpg`);
    fs.access(pathToImg, null, (err) => {
      if (err) {
        console.log(err);
      } else {
        const file = fs.readFileSync(pathToImg);
        const data = `data:image/png;base64,${file.toString("base64")}`;
        res.json(data);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
});

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};
