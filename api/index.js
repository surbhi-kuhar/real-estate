import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "INTERNAL SERVER ERROR";
  return res.status(statuscode).json({
    statuscode,
    message,
    success: false,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
