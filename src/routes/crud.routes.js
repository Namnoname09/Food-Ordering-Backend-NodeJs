const express = require("express");

const createCrudRouter = (
  controller,
  itemPath = "/:id",
  writeMiddleware = [],
) => {
  const router = express.Router();

  router
    .route("/")
    .post(...writeMiddleware, controller.create)
    .get(controller.getAll);

  router
    .route(itemPath)
    .get(controller.getOne)
    .patch(...writeMiddleware, controller.update)
    .delete(...writeMiddleware, controller.remove);

  return router;
};

module.exports = createCrudRouter;
