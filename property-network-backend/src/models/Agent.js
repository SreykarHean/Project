const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Agent = sequelize.define('Agent', {
    agent_id: {
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
    phone: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    agency_name: {
        type: DataTypes.STRING,
    },
    profile_photo: {
        type: DataTypes.STRING,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    tableName: 'agents',
    timestamps: true,
    underscored: true,
}
)

module.exports = Agent