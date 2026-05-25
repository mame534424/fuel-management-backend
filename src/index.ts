import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import stationRouter from "./routes/station.routes.js";
import adminRouter from "./routes/admin.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import managerRouter from "./routes/manager.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/test", testRoutes);
app.use("/stations", stationRouter);
app.use("/admin", adminRouter);
app.use("/bookings", bookingRouter);
app.use("/manager",managerRouter);
app.use("/user",userRouter);
console.log("server started");


app.get("/", (req, res) => {
  res.send("🚀 Fuel Backend API Running");
});
app.get("/ping", (req, res) => {
  console.log("ping hit");
  res.json({ message: "pong" });
});

const PORT = process.env.PORT;
console.log("🔥 DEV SOURCE RUNNING");

const server =
  http.createServer(app);

export const io =
  new Server(server, {

    cors: {
      origin: "*",
    },
});

io.on(
  "connection",
  (socket) => {

    console.log(
      "Socket connected:",
      socket.id
    );

    socket.on(
      "join_booking",
      (
        bookingId
      ) => {

        socket.join(
          `booking:${bookingId}`
        );

        console.log(
          `Joined booking:${bookingId}`
        );
    });

    socket.on(
      "disconnect",
      () => {

        console.log(
          "Socket disconnected"
        );
    });
});

server.listen(
  process.env.PORT,
  () => {

    console.log(
      "Server running"
    );
});