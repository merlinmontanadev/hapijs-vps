const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, Sequelize) => {
  const Test = sequelize.define('test', {
    // Define struktur kolom dalam tabel "users"
    test_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING
    },
  }, {
    timestamps: true // akan menambahkan fields createdAt dan updatedAt
  });

  Test.beforeCreate((test) => {
    test.test_id = uuidv4();
  });


  return Test;
}