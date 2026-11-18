const { DataTypes } = require("sequelize");
const sequelize = require("../config/database")

const Voucher = sequelize.define(
  "Voucher",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    voucherCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "fo-vouchers",
    timestamps: true,
  },
);

module.exports = Voucher;