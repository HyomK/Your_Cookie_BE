const { NUMBER } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = class Quiz extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                option: {
                    type: Sequelize.JSON,
                    allowNull: false,
                },

                answer: {
                    type: Sequelize.JSON,
                    allowNull: false,
                },
            },
            {
                // 테이블에 대한 설정 지정
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Quiz",
                tableName: "quizs",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {
        Quiz.belongsTo(db.Host, { as: "Host" });
    }
};
