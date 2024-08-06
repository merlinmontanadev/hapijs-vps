module.exports = (sequelize, Sequelize) => {
  const KategoriPoin = sequelize.define('kategori_poin', {
    kode_kategori: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nama_kategori: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: true // akan menambahkan fields createdAt dan updatedAt
  });
  


  return KategoriPoin;
}