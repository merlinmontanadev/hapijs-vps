const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
  const Perusahaan = sequelize.define('perusahaan', {
    // Define struktur kolom dalam tabel "users"
    id_perusahaan: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    nama_perusahaan: {
      type: Sequelize.STRING,
      allowNull: false
    },
    alamat: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: true // akan menambahkan fields createdAt dan updatedAt
  });

  Perusahaan.beforeCreate((perusahaan) => {
    perusahaan.id_perusahaan = uuidv4();
  });


  return Perusahaan;
}