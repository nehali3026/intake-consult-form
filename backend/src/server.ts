import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import consultRoutes from "./routes/consultRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", consultRoutes);

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/intake-consult",
    );
    console.log(`DB connected successfully`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

startServer();
