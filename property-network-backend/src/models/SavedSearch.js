const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const SavedSearch = sequelize.define('SavedSearch', {
    search_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    saved_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    keyword: {
        type: DataTypes.STRING,
    },
    filters_json: {
        type: DataTypes.JSON,
    },
    buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: 'saved_searches',
    timestamps: true,
    underscored: true,
}
)

module.exports = SavedSearch