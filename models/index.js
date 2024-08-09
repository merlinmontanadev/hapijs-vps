const { Sequelize } = require("sequelize");
const { config } = require('dotenv')
config()

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging : false,
    timezone: '+07:00'
  });

  const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Alumni = require("./AlumniModel.js")(sequelize, Sequelize);
db.BKK = require("./BursaKerjaKhususModel.js")(sequelize, Sequelize);
db.Guru = require("./GuruModel.js")(sequelize, Sequelize);
db.KategoriPoin = require("./KategoriPoinModel.js")(sequelize, Sequelize);
db.Murid = require("./MuridModel.js")(sequelize, Sequelize);
db.Pelanggaran = require("./PelanggaranModel.js")(sequelize, Sequelize);
db.Poin = require("./PoinModel.js")(sequelize, Sequelize);
db.Perusahaan = require("./PerusahaanInstitusiModel.js")(sequelize, Sequelize);
db.User = require("./UserModel.js")(sequelize, Sequelize);
db.NavItem = require("./NavModel.js")(sequelize, Sequelize);
db.Test = require("./TestModel.js")(sequelize, Sequelize);

db.KategoriPoin.hasMany(db.Poin, {
    foreignKey: 'kode_kategori',
    as: 'Poin',
    onUpdated: 'CASCADE'
  })

db.Poin.belongsTo(db.KategoriPoin, {
  foreignKey: 'kode_kategori',
    as: 'KategoriPoin'
})
//////////////////////////
//Pelanggaran - Poin//

db.Poin.hasMany(db.Pelanggaran, {
  foreignKey: 'kode_poin',
  as: 'Pelanggaran',
})

db.Pelanggaran.belongsTo(db.Poin, {
  foreignKey: 'kode_poin',
  as: 'Poin',
})

//////////////////////////
//Pelanggaran - Guru//


db.Guru.hasMany(db.Pelanggaran, {
  foreignKey: 'id_guru',
  as: 'Pelanggaran',
})

db.Pelanggaran.belongsTo(db.Guru, {
  foreignKey: 'id_guru',
  as: 'Guru',
})

//////////////////////////
//Pelanggaran - Murid//

db.Murid.hasMany(db.Pelanggaran, {
  foreignKey: 'id_murid',
  as: 'Pelanggaran',
})

db.Pelanggaran.belongsTo(db.Murid, {
  foreignKey: 'id_murid',
  as: 'Murid',
})

//////////////////////////
//Alumni - Murid//

db.Murid.hasOne(db.Alumni, {
  foreignKey: 'id_murid',
  as: 'Alumni',
})

db.Alumni.belongsTo(db.Murid, {
  foreignKey: 'id_murid',
  as: 'Murid',
})

//////////////////////////
//Perusahaan - BKK//

db.Perusahaan.hasMany(db.BKK, {
  foreignKey: 'id_perusahaan',
  as: 'Bkk',
})

db.BKK.belongsTo(db.Perusahaan, {
  foreignKey: 'id_perusahaan',
  as: 'Perusahaan',
})


module.exports = {db, sequelize};