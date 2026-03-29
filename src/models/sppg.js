'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sppg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sppg.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user'
      });

      Sppg.hasMany(models.DailyReport, {
        foreignKey: 'id_sppg',
        as: 'dailyReports'
      });

      Sppg.hasMany(models.Review, {
        foreignKey: 'id_sppg',
        as: 'reviews'
      });
    }
  }
  Sppg.init({
    id_sppg: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sppg_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sppg_address: DataTypes.TEXT,
    latitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    monthly_budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Sppg',
    tableName: 'sppg',
    freezeTableName: true
  });
  return Sppg;
};