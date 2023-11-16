import Sequelize, { DataTypes, Model } from "sequelize";
import { db } from "@/libs/db";

class Categories extends Model {
  declare id: number;
  declare alias: string;
  declare title: string;
}

Categories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Categories",
  }
);

export default Categories;
