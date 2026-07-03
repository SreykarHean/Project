const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const QaQuestion = sequelize.define('QaQuestion', {
    question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tag: {
        type: DataTypes.STRING,
    },
    buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
     listing_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: 'qa_questions',
    timestamps: true,
    underscored: true,
}
)

module.exports = QaQuestion