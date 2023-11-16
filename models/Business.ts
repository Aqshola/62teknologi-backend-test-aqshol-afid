import Sequelize, { DataTypes, Model } from "sequelize";
import { db } from "@/libs/db";
import Photos from "./Photos";
import Review from "./Review";
import Business_Categories from "./Business_Categories";

class Business extends Model {
  declare id: string;
  declare alias: string;
  declare name: string;
  declare image_url: string;
  declare rating: number;
  declare url: string;

  declare latitude: number;
  declare longitude: number;
  declare radius: number;
  declare transactions: string;

  //LOCATION
  declare address1: string;
  declare address2: string;
  declare address3: string;
  declare city: string;
  declare zip_code: string;
  declare country: string;
  declare state: string;

  //CLOSED
  declare phone: string;
  declare display_phone: string;
  declare is_closed: boolean;

  declare price: number;
}

Business.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },

    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    radius: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    transactions: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    display_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    price: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    sequelize: db,
    modelName: "Business",
  }
);

Business.hasMany(Photos, {
  foreignKey: "business_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Business.hasMany(Business_Categories, {
  foreignKey: "business_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Business.hasMany(Review, {
  foreignKey: "business_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Business;
