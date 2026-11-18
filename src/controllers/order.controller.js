const { Order } = require("../models");
const createCrudController = require("./crud.controller");

module.exports = createCrudController(Order, [
  "orderCode",
  "firstName",
  "lastName",
  "email",
  "address",
  "phone",
  "methodPayment",
  "voucherId",
]);