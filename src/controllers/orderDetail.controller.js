const { OrderDetail } = require("../models");
const createCrudController = require("./crud.controller");

module.exports = createCrudController(
  OrderDetail,
  ["orderId", "foodId", "quantity"],
  ["orderId", "foodId"],
);