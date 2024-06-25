const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize('auth_service_db', 'newuser', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});


async function createUserAccountsModel() {
    try {
      // Connect to the database
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  
      // Execute SHOW TABLES query
      const [tablesResult] = await sequelize.query("SHOW TABLES");
  
      console.log('Searching for UserAccounts table...');
      let found = false;
      for (const table of tablesResult) {
        if (Object.values(table)[0] === 'UserAccounts') {
          console.log('Table found: UserAccounts');
          found = true;
  
          // Fetch columns for UserAccounts table
          const columnsResult = await sequelize.query("SHOW COLUMNS FROM UserAccounts", {
            type: sequelize.QueryTypes.DESCRIBE
          });
  
          // Log the result to understand its structure
          console.log('Columns Result:', columnsResult);
  
          // Map MySQL types to Sequelize types
          const typeMapping = {
            int: DataTypes.INTEGER,
            varchar: DataTypes.STRING,
            text: DataTypes.TEXT,
            date: DataTypes.DATE,
            datetime: DataTypes.DATE,
            float: DataTypes.FLOAT,
            boolean: DataTypes.BOOLEAN,
            // Add more mappings as needed
          };
  
          // Define the attributes for the model
          const attributes = {};
          for (const column of columnsResult) {
            const columnType = column.Type.split('(')[0];
            attributes[column.Field] = {
              type: typeMapping[columnType] || DataTypes.STRING,
              allowNull: column.Null === 'YES'
            };
          }
  
          // Define the Sequelize model
          const UserAccounts = sequelize.define('UserAccounts', attributes, {
            tableName: 'UserAccounts',
            timestamps: false
          });
  
          // Optionally save the model to a file
          fs.writeFileSync('UserAccountsModel.json', JSON.stringify(attributes, null, 2));
  
          console.log('Model created successfully: UserAccounts');
        }
      }
  
      if (!found) {
        console.log('UserAccounts table not found.');
      }
  
      // Close the connection
      await sequelize.close();
    } catch (error) {
      console.error('Unable to connect to the database or fetch table schema:', error);
    }
  }
  
  createUserAccountsModel();