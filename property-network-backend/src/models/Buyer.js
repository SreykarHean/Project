const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Buyer = sequelize.define('Buyer', {
    buyer_id: {
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
    profile_photo: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('active', 'banned'),
        defaultValue: 'active',
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
    tableName: 'buyers',
    timestamps: true,
    underscored: true,
}
)
module.exports = Buyer