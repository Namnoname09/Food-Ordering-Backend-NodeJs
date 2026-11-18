const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "fo-orders",
        key: "id",
      },
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "fo-foods",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "fo-details",
    timestamps: true,
  },
);

module.exports = OrderDetail;