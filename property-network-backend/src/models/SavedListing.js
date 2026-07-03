const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const SavedListing = sequelize.define('SavedListing', {
    saved_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    saved_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    listing_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
     buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: 'saved_listings',
    timestamps: true,
    underscored: true,
}
)

module.exports = SavedListing