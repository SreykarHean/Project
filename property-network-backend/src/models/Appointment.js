const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
})

module.exports = Appointment