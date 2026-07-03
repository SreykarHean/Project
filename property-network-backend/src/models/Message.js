const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Message = sequelize.define('Message', {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sender_type: {
    type: DataTypes.ENUM('buyer', 'agent'),
    allowNull: false,
    defaultValue: 'buyer',
    field: 'sender_role',
  },
  message_type: {
    type: DataTypes.ENUM('text', 'location'),
    allowNull: false,
    defaultValue: 'text',
  },
  location_lat: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
    field: 'latitude',
  },
  location_lng: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
    field: 'longitude',
  },
  location_label: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  underscored: true,
})

module.exports = Message