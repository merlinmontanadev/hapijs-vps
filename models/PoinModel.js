module.exports = (sequelize, Sequelize) => {
  const Poin = sequelize.define('poin', {
    // Define struktur kolom dalam tabel "users"
    kode_poin: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    jenis: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    poin: {
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



  return Poin;
}