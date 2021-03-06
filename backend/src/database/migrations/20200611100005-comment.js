'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('Comment',
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,          // 值自增
          primaryKey: true,             // 主键
        },

        newsId: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false
        },

        cover: {
          type: Sequelize.STRING,
          allowNull: true
        },

        score: {
          type: Sequelize.INTEGER,
          allowNull: true
        },

        name: {
          type: Sequelize.CHAR(60),
          allowNull: true
        },

        content: {
          type: Sequelize.TEXT,
          allowNull: true
        },
      
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      },
      {
        charset: 'utf8mb4'
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('Comment');
  }
};
