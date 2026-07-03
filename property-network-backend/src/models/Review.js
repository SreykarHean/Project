const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Review = sequelize.define('Review', {
    review_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
}
)

module.exports = Review