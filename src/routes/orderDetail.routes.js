const controller = require('../controllers/orderDetail.controller');
const createCrudRouter = require('./crud.routes');

module.exports = createCrudRouter(
    controller, "/:orderId/:foodId",
)