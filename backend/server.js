import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import router from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
connectDB(); //Connect to MongoDB
const port = process.env.PORT;
console.log(port);
const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/api/config/paypal", (req, res) =>
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  })
);

const __dirname = path.resolve(); //Set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
export default router;
