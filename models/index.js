"use strict";

const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const Host = require("./host");
const Guest = require("./guest");
const Quiz = require("./quiz");

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Host = Host;
db.Guest = Guest;
db.Quiz = Quiz;

Host.init(sequelize);
Guest.init(sequelize);
Quiz.init(sequelize);

Host.associate(db);
Guest.associate(db);
Quiz.associate(db);
module.exports = db;
