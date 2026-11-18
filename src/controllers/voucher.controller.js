const { Voucher } = require("../models");
const createCrudController = require("./crud.controller");

module.exports = createCrudController(Voucher, ["voucherCode", "discount"]);
