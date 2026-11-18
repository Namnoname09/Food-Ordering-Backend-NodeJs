const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.STRING(255),
    },
    phone: {
      type: DataTypes.STRING(255),
    },
    methodPayment: {
      type: DataTypes.STRING(255),
    },
    voucherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "fo-vouchers",
        key: "id",
      },
    },
  },
  {
    tableName: "fo-orders",
    timestamps: true,
  },
);

module.exports = Order;