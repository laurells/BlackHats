'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'plan', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'planA' // default to planA if not specified
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'plan');
  }
};
