'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Budget.belongsTo(models.DailyReport, {
        foreignKey: 'id_daily_report',
        as: 'dailyReport'
      });
    }
  }
  Budget.init({
    id_budget: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_daily_report: {
      type: DataTypes.UUID,
      allowNull: false
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    item_price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    
  }, {
    sequelize,
    modelName: 'Budget',
    tableName: 'budget',
    freezeTableName: true
  });
  return Budget;
};