const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
  const Pelanggaran = sequelize.define('pelanggaran', {
    // Define struktur kolom dalam tabel "users"
    kode_pelanggaran: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    nama_pelapor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    keterangan: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tindak_lanjut: {
        type: Sequelize.STRING,
        allowNull: false
    }
  }, {
    timestamps: true // akan menambahkan fields createdAt dan updatedAt
  });

  Pelanggaran.beforeCreate((pelanggaran) => {
    pelanggaran.kode_pelanggaran = uuidv4();
  });



  return Pelanggaran;
}
