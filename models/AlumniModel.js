const { v4: uuidv4 } = require('uuid');
 
  module.exports = (sequelize, Sequelize) => {
    const Alumni = sequelize.define("alumni" ,{
      id_alumni: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      tahun_lulus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nomor_hp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      keterangan: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      timestamps: true // akan menambahkan fields createdAt dan updatedAt
    });

    Alumni.beforeCreate((alumni) => {
      alumni.id_alumni = uuidv4();
    });

  

    return Alumni;
  };