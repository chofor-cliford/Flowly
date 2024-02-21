import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import { UpdateCredits, createUser, deleteUser, getUserById, updateUser } from "./routes/userRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();

const PORT = import.meta.PORT || 8080;

const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" }));

// app.use("/api/v1/post", postRoutes);
// app.use("/api/v1/dalle", dalleRoutes);
app.post("/api/v1/createUser", createUser)
app.get("/api/v1/getUserById/:userId", getUserById)
app.put("/api/v1/updateUser", updateUser)
app.delete("/api/v1/deleteUser/:clerkId", deleteUser)
app.put("/api/v1/updateCredits/:userId", UpdateCredits)
// 

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello from FLOWLY!",
  });
});


const startServer = async () => {
  try {
    // eslint-disable-next-line no-undef
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
