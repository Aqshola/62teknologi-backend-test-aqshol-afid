import Sequelize, { DataTypes, Model } from "sequelize";
import { db } from "@/libs/db";
import Categories from "./Categories";
import Business from "./Business";

class Business_Categories extends Model {
  declare business_id: string;
  declare category_id: string;
  declare id: string;
}

Business_Categories.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Business_Categories",
  }
);

Business_Categories.belongsTo(Categories, {
  foreignKey: "category_id",
});

export default Business_Categories;
