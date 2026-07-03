const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const ListingPhoto = sequelize.define('ListingPhoto', {
  photo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  photo_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'listing_photos',
  timestamps: true,
  underscored: true,
})

module.exports = ListingPhoto