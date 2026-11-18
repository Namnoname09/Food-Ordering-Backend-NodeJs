const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const match = /^Bearer\s+(\S+)$/i.exec(authorization);

  if (!match) {
    return res.status(401).json({ message: "Thiếu access token" });
  }

  let payload;
  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({
      message: "Access token không hợp lệ hoặc đã hết hạn",
    });
  }

  if (payload.type === "refresh" || !Number.isInteger(payload.userId)) {
    return res.status(401).json({ message: "Access token không hợp lệ" });
  }

  try {
    const user = await User.findByPk(payload.userId, {
      attributes: ["id", "role"],
    });

    if (!user) {
      return res.status(401).json({
        message: "Tài khoản không tồn tại",
      });
    }

    req.user = user;
  } catch (error) {
    return next(error);
  }
  return next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Yêu cầu quyền Admin" });
  }
  return next();
};

module.exports = { authenticate, requireAdmin };
