'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      School.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user'
      });

      School.hasMany(models.Review, {
        foreignKey: 'id_school',
        as: 'reviews'
      });
    }
  }
  School.init({
    id_school: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    school_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    school_address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'School',
    tableName: 'school',
    freezeTableName: true
  });
  return School;
};