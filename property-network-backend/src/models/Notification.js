const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Notification = sequelize.define('Notification', {
    notif_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    // where the frontend should navigate to when this notification is clicked
    // e.g. "/buyer/messages/3", "/agent/messages/7", "/buyer/listings/12"
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // Exactly one of buyer_id / agent_id will be set, depending on who
    // this notification is for.
    buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

}, {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
}
)

module.exports = Notification