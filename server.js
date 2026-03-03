import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import router from "./routes/authRoutes.js";
import docRouter from "./routes/documentRoutes.js";
import signRouter from "./routes/signRouter.js";

connectDB();

console.log("Cloud Key Check server :", process.env.CLOUD_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://pdf-sign-app-frontend.vercel.app",
      "https://pdf-sign-app-frontend-git-main-vidhi-nagars-projects-f2385878.vercel.app",
    ], // Aapka frontend URL
    credentials: true, // Cookies allow karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//API Endpoints
app.get("/", (req, res) => {
  res.render("dashboard").send("API is running...");
});

app.use("/api/auth", router);
app.use("/api/docs", docRouter);
app.use("/api", signRouter);

app.listen(PORT, () => console.log(`Port is running on :${PORT}`));
