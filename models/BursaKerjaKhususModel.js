const { v4: uuidv4 } = require('uuid');
  
module.exports = (sequelize, Sequelize) => {
  const BKK = sequelize.define('bkk', {
    id_bkk: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    nama_lowongan: {
      type: Sequelize.STRING,
      allowNull: false
    },
    keterangan: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lokasi: {
      type: Sequelize.STRING,
      allowNull: false
    },
    expiredIn: {
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



  BKK.beforeCreate((bkk) => {
    bkk.id_bkk = uuidv4();
  });

  return BKK;
};