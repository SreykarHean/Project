const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Listing = sequelize.define('Listing', {
  listing_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  property_type: {
    type: DataTypes.ENUM('house', 'apartment', 'condo', 'villa', 'flat'),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('available', 'pending', 'sold', 'archived'),
    defaultValue: 'available',
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  admin_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'listings',
  timestamps: true,
  underscored: true,
})

module.exports = Listing