const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const ListingDetail = sequelize.define('ListingDetail', {
  detail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  feature_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  feature_value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'listing_details',
  timestamps: true,
  underscored: true,
})

module.exports = ListingDetail