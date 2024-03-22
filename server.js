const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket
const io = require("socket.io")(http);
let connectionCount = 0;
io.on("connection", (socket) => {
  connectionCount++;
  io.emit("connectionCount", connectionCount);
  console.log("Connected. Total connections:", connectionCount);
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
  socket.on("disconnect", () => {
    connectionCount--;
    io.emit("connectionCount", connectionCount);
    console.log("A user disconnected. Total connections:", connectionCount);
  });
});
