const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, Sequelize) => {
  const Guru = sequelize.define('guru', {
    id_guru: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    nip: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      }
    },
    nutpk: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      }
    },
    pangkat_gol: {
      type: Sequelize.STRING,
      allowNull: false
    },
    jabatan: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nama_lengkap: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tempat_lahir: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tanggal_lahir: {
      type: Sequelize.STRING,
      allowNull: false
    },
    alamat: {
      type: Sequelize.STRING,
      allowNull: false
    },
    desa_kel: {
      type: Sequelize.STRING,
      allowNull: false
    },
    kecamatan: {
      type: Sequelize.STRING,
      allowNull: false
    },
    kabupaten: {
      type: Sequelize.STRING,
      allowNull: false
    },
    agama: {
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

  Guru.beforeCreate((guru) => {
    guru.id_guru = uuidv4();
  });



  return Guru;
}
