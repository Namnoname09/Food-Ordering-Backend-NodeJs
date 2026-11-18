const { Food } = require("../models");
const createCrudController = require("./crud.controller");

module.exports = createCrudController(Food, [
  "name",
  "imageUrl",
  "price",
  "rating",
  "time",
]);