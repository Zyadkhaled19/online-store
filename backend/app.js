const dotenv = require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/orderRoutes");
const userRouter = require("./routes/user.route");
const errMiddleware = require("./middleware/errMiddellware");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  }),
);
app.use(express.json());

app.use("/api/v1/", authRouter);
app.use("/api/v1/", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/", userRouter);

app.use(errMiddleware);

module.exports = {
  app,
};
