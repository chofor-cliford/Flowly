/* eslint-disable no-undef */
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import { UpdateCredits, createUser, deleteUser, getUserById, updateUser } from "./routes/userRoutes.js";
import { webhookRoute } from "./routes/webhookRoutes.js";
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
app.post(`${process.env.URL}/createUser`, createUser);
app.get(`${process.env.URL}/:userId`, getUserById)
app.put(`${process.env.URL}/updateUser`, updateUser)
app.delete(`${process.env.URL}/deleteUser/:clerkId`, deleteUser)
app.put(`${process.env.URL}/updateCredits/:userId`, UpdateCredits)
app.post(`${process.env.URL}/webhooks`, webhookRoute)
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
