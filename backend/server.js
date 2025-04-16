import express from "express";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
connectDB(); //Connect to MongoDB
const port = process.env.PORT;
const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
