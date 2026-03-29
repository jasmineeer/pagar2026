'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DailyReport.belongsTo(models.Sppg, {
        foreignKey: 'id_sppg',
        as: 'sppg'
      });

      DailyReport.hasMany(models.Budget, {
        foreignKey: 'id_daily_report',
        as: 'budgets'
      });

      DailyReport.hasMany(models.Attachment, {
        foreignKey: 'id_entity',
        constraints: false,
        scope: { 
          entity_type: 'DAILY_REPORT' 
        },
        as: 'attachments'
      });
    }
  }
  DailyReport.init({
    id_daily_report: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_sppg: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date_report: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    menu_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    meal_time: DataTypes.STRING,
    total_portion: DataTypes.INTEGER,
    menu_description: DataTypes.TEXT,
    total_expense: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    energy: DataTypes.FLOAT,
    protein: DataTypes.FLOAT,
    fat: DataTypes.FLOAT,
    carbohydrate: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'DailyReport',
    tableName: 'daily_report',
    freezeTableName: true
  });
  return DailyReport;
};