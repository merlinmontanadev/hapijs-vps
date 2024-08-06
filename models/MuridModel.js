const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, Sequelize) => {
  const Murid = sequelize.define('murid', {
    // Define struktur kolom dalam tabel "users"
    id_murid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    nik_murid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      }
    },
    nipd: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      }
    },
    nis: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      }
    },
    nisn: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
      }
    },
    file: {
      type: Sequelize.BLOB('medium'),
    },
    fileMimeType: {
      type: Sequelize.STRING // Kolom untuk menyimpan tipe konten file
    },
    nama_lengkap: {
      type: Sequelize.STRING,
      allowNull: false
    },
    jenis_kelamin: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tempat_lahir: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tanggal_lahir: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    agama: {
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
    },
    prov: {
      type: Sequelize.STRING,
      allowNull: false
    },
    kel_des: {
      type: Sequelize.STRING,
      allowNull: false
    },
    kec: {
      type: Sequelize.STRING,
      allowNull: false
    },
    kab: {
      type: Sequelize.STRING,
      allowNull: false
    },
    telepon: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hp: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    asal_sekolah: {
      type: Sequelize.STRING,
      allowNull: false
    },
    t_masuk: {
      type: Sequelize.STRING,
      allowNull: false
    },
    t_lulus: {
      type: Sequelize.STRING,
      allowNull: false
    },
    t_smp: {
      type: Sequelize.STRING,
      allowNull: false
    },
    i_smp: {
      type: Sequelize.BLOB('medium'),
      allowNull: false
    },
    i_SmpMimeType: {
      type: Sequelize.STRING // Kolom untuk menyimpan tipe konten ijazah
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
    
  }, {
    timestamps: true // akan menambahkan fields createdAt dan updatedAt
  });

  Murid.beforeCreate((murid) => {
    murid.id_murid = uuidv4();
  });


  
  return Murid;
}