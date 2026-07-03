const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Report = sequelize.define('Report', {
    report_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    report_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
        defaultValue: 'pending',
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    listing_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},{
    tableName: 'reports',
    timestamps: true,
    underscored: true,
}
)

module.exports = Report