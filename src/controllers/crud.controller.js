const createCrudController = (Model, allowedFields, primaryKeys = ["id"]) => {
  const pickBody = (body) => {
    const data = {};
    for (const field of allowedFields) {
      if (body?.[field] !== undefined) {
        data[field] = body[field];
      }
    }
    return data;
  };

  const getWhere = (params) => {
    const where = {};

    for (const key of primaryKeys) {
      const value = params[key];
      if (
        typeof value !== "string" ||
        !/^[1-9]\d*$/.test(value) ||
        !Number.isSafeInteger(Number(value)) ||
        Number(value) > 2147483647
      ) {
        return null;
      }
      where[key] = Number(value);
    }
    return where;
  };

  const handleError = (error, res) => {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Dữ liệu bị trùng",
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({
        message:
          "Dữ liệu tham chiếu không tồn tại hoặc bản ghi đang được sử dụng",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: error.errors.map((item) => item.message).join(", "),
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  };

  const create = async (req, res) => {
    try {
      const data = pickBody(req.body);
      const record = await Model.create(data);

      return res.status(201).json(record);
    } catch (error) {
      return handleError(error, res);
    }
  };

  const getAll = async (req, res) => {
    try {
      const records = await Model.findAll();
      return res.status(200).json(records);
    } catch (error) {
      return handleError(error, res);
    }
  };
  const getOne = async (req, res) => {
    try {
      const where = getWhere(req.params);
      if (!where) {
        return res.status(400).json({
          message: "ID phải là số nguyên dương hợp lệ",
        });
      }

      const record = await Model.findOne({ where });

      if (!record) {
        return res.status(404).json({
          message: "Không tìm thấy dữ liệu",
        });
      }
      return res.status(200).json(record);
    } catch (error) {
      return handleError(error, res);
    }
  };
  const update = async (req, res) => {
    try {
      const where = getWhere(req.params);

      if (!where) {
        return res.status(400).json({
          message: "ID phải là số nguyên dương hợp lệ",
        });
      }
      const data = pickBody(req.body);

      // Không thay đổi khóa chính
      for (const key of primaryKeys) {
        delete data[key];
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          message: "Không có trường hợp lệ để cập nhật",
        });
      }

      const record = await Model.findOne({ where });

      if (!record) {
        return res.status(404).json({
          message: "Không tìm thấy dữ liệu",
        });
      }

      await record.update(data);

      return res.status(200).json(record);
    } catch (error) {
      return handleError(error, res);
    }
  };

  const remove = async (req, res) => {
    try {
      const where = getWhere(req.params);

      if (!where) {
        return res.status(400).json({
          message: "ID phải là số nguyên dương hợp lệ",
        });
      }

      const record = await Model.findOne({ where });

      if (!record) {
        return res.status(404).json({
          message: "Không tìm thấy dữ liệu",
        });
      }

      await record.destroy();
      return res.status(204).send();
    } catch (error) {
      return handleError(error, res);
    }
  };
  return {
    create,
    getAll,
    getOne,
    update,
    remove,
  };
};

module.exports = createCrudController;
