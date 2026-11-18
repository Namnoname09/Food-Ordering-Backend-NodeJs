const sequelize = require("../config/database");

const User = require("./user.model");
const Voucher = require("./voucher.model");
const Food = require("./food.model");
const Order = require("./order.model");
const OrderDetail = require("./orderDetail.model");

// Một Voucher có thể dùng cho nhiều đơn hàng
Voucher.hasMany(Order, {
  foreignKey: "voucherId",
  as: "orders",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Order.belongsTo(Voucher, {
  foreignKey: "voucherId",
  as: "voucher",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

// Một đơn hàng có nhiều chi tiết dơn hàng
Order.hasMany(OrderDetail, {
  foreignKey: "orderId",
  as: "orderDetails",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

OrderDetail.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

// Một món ăn có thể nằm trong nhiều chi tiết đơn hàng
Food.hasMany(OrderDetail, {
  foreignKey: "foodId",
  as: "orderDetails",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

OrderDetail.belongsTo(Food, {
  foreignKey: "foodId",
  as: "food",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

module.exports = {
  sequelize,
  User,
  Voucher,
  Food,
  Order,
  OrderDetail,
};
