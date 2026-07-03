const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Admin = sequelize.define('Admin', {
    admin_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
},
    reset_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
},
}, {
    tableName: 'admins',
    timestamps: true,
    underscored: true,
}
)

module.exports = Admin