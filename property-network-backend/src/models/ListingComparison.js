const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const ListingComparison = sequelize.define('ListingComparison', {
    compare_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    listing_ids: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    buyer_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: 'listing_comparisons',
    timestamps: true,
    underscored: true,
}
)

module.exports = ListingComparison