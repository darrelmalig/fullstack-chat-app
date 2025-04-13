import express from 'express'
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser"
import {app, server} from './lib/socket.js'
import path from "path";

dotenv.config(); //init dotenv

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); //allow us to accept JSON data in the req.body
app.use(cookieParser()); //allow us to parse the cookie

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  connectDB();
})