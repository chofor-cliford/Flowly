/* eslint-disable no-undef */
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import {
  UpdateCredits,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from "./routes/userRoutes.js";
import { webhookRoute } from "./routes/webhookRoutes.js";
import {
  addImage,
  deleteImage,
  getAllImages,
  getImageById,
  updateImage,
} from "./routes/imageRoutes.js";
import { checkoutCredits, stripePOST } from "./routes/stripeRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import dalleRoutes from "./routes/dalleRoutes.js";
// 70.64.148.74
dotenv.config();

const PORT = import.meta.PORT || 8080;

const app = express();
app.use(cors());
// Middleware to parse JSON bodies
// Parse raw request bodies for signature verification
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/stripe") {
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// app.use("/api/v1/post", postRoutes);
// app.use("/api/v1/dalle", dalleRoutes);

// User routes
app.post(`/api/v1/createUser`, createUser);
app.get(`/api/v1/getUserById/:userId`, getUserById);
app.put(`/api/v1/updateUser`, updateUser);
app.delete(`/api/v1/deleteUser/:clerkId`, deleteUser);
app.put(`/api/v1/updateCredits/:userId`, UpdateCredits);
app.post(`/api/v1/webhooks`, webhookRoute);

// Image routes
app.post(`/api/v1/addImage/:userId`, addImage);
app.get(`/api/v1/getImageById/:imageId`, getImageById);
app.get("/api/v1/getAllImages", getAllImages);
app.put(`/api/v1/updateImage/:userId`, updateImage);
app.delete(`/api/v1/deleteImage/:imageId`, deleteImage);

// Stripe routes
app.post(
  `/api/v1/stripe`,
  express.raw({ type: "application/json" }),
  stripePOST
);
app.post(`/api/v1/checkoutCredits`, checkoutCredits);
// https://flowly.onrender.com/api/v1/createTransaction

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
