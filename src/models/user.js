'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.School, {
        foreignKey: 'id_user',
        as: 'schoolProfile'
      });

      User.hasOne(models.Sppg, {
        foreignKey: 'id_user',
        as: 'sppgProfile'
      });

      User.hasMany(models.Review, {
        foreignKey: 'id_user',
        as: 'reviews'
      })
    }
  }
  User.init({
    id_user: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'PUBLIC', 'SCHOOL', 'SPPG'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    registration_code: DataTypes.STRING,
    bgn_code: DataTypes.STRING,
    account_status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'APPROVED'
    },
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    freezeTableName: true,
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  });
  return User;
};