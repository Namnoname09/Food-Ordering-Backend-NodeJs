const controller = require("../controllers/voucher.controller");
const createCrudRouter = require("./crud.routes");

module.exports = createCrudRouter(controller);