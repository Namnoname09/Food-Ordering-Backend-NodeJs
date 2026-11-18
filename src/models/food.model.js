const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Food = sequelize.define(
  "Food",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    time: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "fo-foods",
    timestamps: true,
  },
);

module.exports = Food;