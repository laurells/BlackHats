'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AutoAccount extends Model {
    static associate(models) {
      // Define association here
      AutoAccount.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  AutoAccount.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false
      },
      platformUser: {
        type: DataTypes.STRING,
        allowNull: false
      },
      platformPass: {
        type: DataTypes.STRING,
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING
      },
      targetUser: {
        type: DataTypes.STRING
      },
      comment_2: {
        type: DataTypes.STRING
      },
      comment_3: {
        type: DataTypes.STRING
      },
      comment_4: {
        type: DataTypes.STRING
      },
      comment_5: {
        type: DataTypes.STRING
      },
      targetUser2: {
        type: DataTypes.STRING
      },
      targetUser3: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'AutoAccount',
      tableName: 'AutoAccounts',
    }
  );

  return AutoAccount;
};
