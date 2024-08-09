
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, Sequelize) => {
  const NavItem = sequelize.define('NavItem', {
    // Define struktur kolom dalam tabel "users"
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  href: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  parent_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'nav_items', // Nama model harus sesuai dengan nama tabel
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  single: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  group: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  tableName: 'nav_items',
  timestamps: false, // Set to true if you want to use timestamps
});  
  return NavItem;
}