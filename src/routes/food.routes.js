const controller = require("../controllers/food.controller");
const createCrudRouter = require("./crud.routes");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");

module.exports = createCrudRouter(controller, "/:id", [
  authenticate,
  requireAdmin,
]);