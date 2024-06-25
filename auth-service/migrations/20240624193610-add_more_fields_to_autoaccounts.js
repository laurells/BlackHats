'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('AutoAccounts', 'comment_2', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('AutoAccounts', 'comment_3', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('AutoAccounts', 'comment_4', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('AutoAccounts', 'comment_5', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('AutoAccounts', 'targetUser2', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('AutoAccounts', 'targetUser3', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('AutoAccounts', 'comment_2');
    await queryInterface.removeColumn('AutoAccounts', 'comment_3');
    await queryInterface.removeColumn('AutoAccounts', 'comment_4');
    await queryInterface.removeColumn('AutoAccounts', 'comment_5');
    await queryInterface.removeColumn('AutoAccounts', 'targetUser2');
    await queryInterface.removeColumn('AutoAccounts', 'targetUser3');
  }
};
