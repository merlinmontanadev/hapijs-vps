const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    // Define struktur kolom dalam tabel "users"
    user_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nohp: {
      type: Sequelize.STRING,
      allowNull: false
    },
    jk: {
      type: Sequelize.STRING,
      allowNull: false
    },
    file: {
      type: Sequelize.BLOB('medium'),
    },
    fileMimeType: {
      type: Sequelize.STRING // Kolom untuk menyimpan tipe konten file
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    },
    refreshToken: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true
    },
    ip_address: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: true // akan menambahkan fields createdAt dan updatedAt
  });

  User.beforeCreate((user) => {
    user.user_id = uuidv4();
  });


  return User;
}