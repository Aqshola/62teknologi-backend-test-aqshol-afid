import Sequelize, { DataTypes, HasOne, Model } from "sequelize";
import { db } from "@/libs/db";
import User from "./User";

class Review extends Model {
  declare id: string;
  declare rating: number;
  declare business_id: string;
  declare text: string;
  declare user_id: string;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },

    rating: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Review",
  }
);

Review.belongsTo(User, {
  foreignKey: "user_id",
});
export default Review;
