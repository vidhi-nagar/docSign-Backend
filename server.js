import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import router from "./routes/authRoutes.js";
import docRouter from "./routes/documentRoutes.js";
import signRouter from "./routes/signRouter.js";

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database Connection Failed", err);
  });

console.log("Cloud Key Check server :", process.env.CLOUD_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Requested-With",
//   );

//   // OPTIONS request ko yahi khatam karo
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
console.log(allowedOrigins);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // Aapka frontend URL
    credentials: true, // Cookies allow karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// app.options(cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
//   );
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

//API Endpoints
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", router);
app.use("/api/docs", docRouter);
app.use("/api", signRouter);

app.listen(PORT, () => console.log(`Port is running on :${PORT}`));

// export default app;
