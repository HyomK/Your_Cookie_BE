const { NUMBER } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = class Host extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },

                password: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },
                cookieId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },

                token: {
                    type: Sequelize.STRING(400),
                    allowNull: true,
                },
            },
            {
                // 테이블에 대한 설정 지정
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Host",
                tableName: "hosts",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {}
};
