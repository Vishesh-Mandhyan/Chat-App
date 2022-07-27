const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const userRoute = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoutes");
const socket = require("socket.io");
const cors = require("cors");
require("dotenv").config();

//middlewares

app.use(cors());
app.use(express.json());

//api Routes

app.use("/api/auth", userRoute);
app.use("/api/messages", messagesRoute);

const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// configuring socket.io

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
// connecting to database

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", (req, res) => {
  res.send("Hello duniya");
});

//Listening at port 5000

server.listen(process.env.PORT, () => {
  console.log("SERVER IS RUNNING");
});
