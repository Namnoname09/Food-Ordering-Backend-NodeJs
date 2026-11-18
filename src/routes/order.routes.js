const controller = require('../controllers/order.controller');
const createCrudRouter = require('./crud.routes');

module.exports = createCrudRouter(controller)