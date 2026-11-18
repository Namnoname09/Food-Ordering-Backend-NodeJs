const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

const signAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES || "30m",
  });

const signRefreshToken = (userId) =>
  jwt.sign({ userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

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

const createUser = async (req, res) => {
  try {
    const { fullName, email, password, gender, dateOfBirth } = req.body ?? {};

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        message: "Vui lòng nhập họ tên, email và mật khẩu",
      });
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      res.status(400).json({
        message: "Họ tên và email không được để trống",
      });
      return;
    }

    // bcrypt chỉ xử lý tối đa 72 byte
    if (password.length < 8 || Buffer.byteLength(password, "utf-8") > 72) {
      res.status(400).json({
        message: "Mật khẩu phải có ít nhất 8 ký tự và tối đa 72 byte",
      });
      return;
    }

    const birthDate =
      typeof dateOfBirth === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
        ? new Date(dateOfBirth)
        : null;
    if (
      !["male", "female", "other"].includes(gender) ||
      !birthDate ||
      Number.isNaN(birthDate.getTime()) ||
      birthDate.toISOString().slice(0, 10) !== dateOfBirth
    ) {
      return res
        .status(400)
        .json({ message: "Giới tính hoặc ngày sinh không hợp lệ" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      gender,
      dateOfBirth,
      role: "user",
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password ||
      Buffer.byteLength(password, "utf-8") > 72
    ) {
      res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
      return;
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    const isPasswordValid = await bcrypt.compare(
      password,
      user ? user.passwordHash : DUMMY_HASH,
    );

    if (!user || !isPasswordValid) {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
      return;
    }

    const accessToken = signAccessToken(user.id);

    res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken: signRefreshToken(user.id),
      tokenType: "Bearer",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return handleError(error, res);
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (typeof refreshToken !== "string" || !refreshToken.trim()) {
    return res.status(401).json({ message: "Thiếu refresh token" });
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken.trim(), process.env.JWT_REFRESH_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({
      message: "Refresh token không hợp lệ hoặc đã hết hạn",
    });
  }

  if (payload.type !== "refresh" || !Number.isInteger(payload.userId)) {
    return res.status(401).json({ message: "Refresh không hợp lệ" });
  }
  try {
    const user = await User.findByPk(payload.userId, {
      attributes: ["id"],
    });

    if (!user) {
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }

    return res.json({
      accessToken: signAccessToken(user.id),
      tokenType: "Bearer",
    });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports = { createUser, UserLogin, refreshAccessToken };
