import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import testRoute from "./routes/testRoute";
import authRoute from "./routes/authRoute";
import jobRoutes from "./routes/jobRoute";
import applicationRoutes from "./routes/applicationRoutes";
import statsRoutes from "./routes/statsRoutes";
import seekerProfileRoutes from "./routes/seekerProfileRoutes";
import savedJobRoutes from "./routes/savedJobRoutes";
import cors from "cors";
dotenv.config();
connectDB();

const app = express();
const PORT = 5000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Portal API is running...");
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Route middleware
app.use("/api", testRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/saved-jobs", savedJobRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/seeker", seekerProfileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
