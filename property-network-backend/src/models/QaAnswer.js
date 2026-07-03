const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const QaAnswer = sequelize.define('QaAnswer', {
    answer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_helpful: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: 'qa_answers',
    timestamps: true,
    underscored: true,
}
)

module.exports = QaAnswer