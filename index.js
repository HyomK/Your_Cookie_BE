const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = 8003;
const app = express();

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("DB Connected Success");
    })
    .catch((err) => {
        console.error(err);
    });

app.use(
    cors({
        origin: true, // ["http://localhost:3000"],
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(express.json()); // json 파싱
app.use(bodyParser.urlencoded({ extended: false }));

app.set("port", process.env.PORT || PORT);

app.use("/", (req, res) => {
    res.status(200).send("Auth server");
});

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}...`);
});
