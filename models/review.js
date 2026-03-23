'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, { 
        foreignKey: 'id_user', 
        as: 'reviewer' 
      });
      
      Review.belongsTo(models.Sppg, { 
        foreignKey: 'id_sppg', 
        as: 'sppg' 
      });
      
      Review.belongsTo(models.School, { 
        foreignKey: 'id_school', 
        as: 'school' 
      });

      Review.hasMany(models.Attachment, {
        foreignKey: 'id_entity',
        constraints: false,
        scope: { 
          entity_type: 'REVIEW' 
        },
        as: 'attachments'
      });
    }
  }
  Review.init({
    id_review: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_sppg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_school: DataTypes.INTEGER,
    id_user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_anonymous: DataTypes.BOOLEAN,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    rating_score: {
      type: DataTypes.INTEGER,
      validate: { 
        min: 1, 
        max: 5 
      }
    },
    status_review: {
      type: DataTypes.ENUM('MENUNGGU', 'INVESTIGASI', 'SELESAI'),
      allowNull: false,
      defaultValue: 'MENUNGGU'
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'review',
    freezeTableName: true
  });
  return Review;
};