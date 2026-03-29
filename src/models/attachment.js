'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  Attachment.init({
    id_attachment: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_entity: {
      type: DataTypes.UUID,
      allowNull: false
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    file_type: DataTypes.STRING,
    file_size: DataTypes.INTEGER,
    file_category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attachment',
    tableName: 'attachment',
    freezeTableName: true
  });
  return Attachment;
};