require("dotenv").config();
const path = require("node:path");
const voucherRouter = require("./src/routes/voucher.routes");
const foodRouter = require("./src/routes/food.routes");
const orderRouter = require("./src/routes/order.routes");
const orderDetailRouter = require("./src/routes/orderDetail.routes");
const authRouter = require("./src/routes/auth.routes");


const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/vouchers", voucherRouter);
app.use("/foods", foodRouter);
app.use("/orders", orderRouter);
app.use("/order-details", orderDetailRouter);
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.use(express.static(path.join(__dirname, "view")));

module.exports = app;
