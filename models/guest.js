const Sequelize = require("sequelize");

module.exports = class Guest extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },
                answer: {
                    type: Sequelize.JSON,
                    allowNull: true,
                },
                score: { type: Sequelize.INTEGER, allowNull: true },
                comment: {
                    type: Sequelize.STRING(30),
                    allowNull: true,
                },
            },
            {
                // 테이블에 대한 설정 지정
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Guest",
                tableName: "Guest",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {
        db.Host.hasMany(db.Guest);
        db.Guest.belongsTo(db.Host);
    }
};
