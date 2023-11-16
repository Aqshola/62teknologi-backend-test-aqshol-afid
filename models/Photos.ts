import Sequelize, { DataTypes, Model } from "sequelize";
import { db } from "@/libs/db";
import Business from "./Business";

class Photos extends Model {
  declare id: string;
  declare business_id: string;
  declare photo: string;
}

Photos.init(
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
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Photos",
  }
);

export default Photos;
