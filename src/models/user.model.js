const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  gender: {
    type: DataTypes.ENUM("male", "female", "other"),
    allowNull: false,
  },

  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  },
});

module.exports = User;
