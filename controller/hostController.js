const bcrypt = require("bcrypt");
const { Host, Quiz, Guest } = require("../models");

module.exports = {
    registerHost: async (req, res) => {
        try {
            const name = req.body.name;
            const pwd = req.body.password;

            if (!name || !pwd) {
                return res.status(400).json({
                    message: "이름과 비밀번호 입력을 확인해주세요.",
                });
            }

            const user = await Host.findOne({
                where: { name: name, password: pwd },
            });

            if (user) {
                return res.status(400).json({
                    message: "이미 등록된 사용자가 있습니다.",
                });
            }

            const salt = 10;
            const encryptedToken = bcrypt.hashSync(
                JSON.stringify({ name: name, password: pwd }),
                salt
            );

            const token = new Promise((resolve, reject) => {
                bcrypt.hash(
                    JSON.stringify({ name: name, password: pwd }),
                    salt,
                    (err, encryptedToken) => {
                        console.log(encryptedToken);
                        if (encryptedToken)
                            resolve(encryptedToken.replace("/", ""));
                        else reject(err);
                    }
                );
            }).then((token) => {
                Host.create({ name: name, password: pwd, token: token });
                console.log("token 발급", token);
                return res.status(200).json({
                    message: "사용자 등록 성공",
                    data: { token: token },
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },

    findUserByInfo: async (req, res) => {
        const name = req.body.name;
        const pwd = req.body.password;

        if (!name || !pwd) {
            return res.status(400).json({
                message: "이름과 비밀번호 입력을 확인해주세요.",
            });
        }

        const user = await Host.findOne({
            where: { name: name, password: pwd },
        }).then((res) => {
            if (res) return res.dataValues;
            else return null;
        });

        if (!user) {
            return res.status(400).json({
                message: "이름과 비밀번호를 확인해주세요.",
            });
        }
        return res.status(200).json({
            message: "사용자 등록 성공",
            data: {
                name: user.name,
                token: user.token,
                cookieId: user.cookieId,
            },
        });
    },

    findUserByToken: async (req, res) => {
        try {
            const token = req.query.host || req.body.token;
            console.log("token 확인", token);
            if (!token) {
                return res.status(401).json({
                    message: "유효하지 않은 토큰입니다",
                });
            }
            const user = await Host.findOne({ where: { token: token } }).then(
                (res) => (res ? res.dataValues : null)
            );
            if (!user) {
                {
                    return res.status(400).json({
                        message: "사용자 조회 실패",
                    });
                }
            }
            return res.status(200).json({
                message: "사용자 조회 성공",
                data: { name: user.name, cookieId: user.cookieId },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },
    setHostCookie: async (req, res) => {
        try {
            const token = req.params.token;
            const cookieId = req.body.cookieId;

            if (!token || !cookieId) {
                console.log(req.params);
                return res.status(400).json({
                    message: "잘못된 요청",
                });
            }
            const user = await Host.findOne({ where: { token: token } }).then(
                (res) => res.dataValues
            );

            if (!user) {
                return res.status(401).json({
                    message: "유효하지 않은 토큰입니다",
                });
            }
            await Host.update(
                { cookieId: cookieId },
                { where: { token: user.token } }
            );

            return res.status(200).json({
                message: "사용자 쿠키 등록 성공",
                data: { name: user.name },
            });
            //TODO 질문 반환
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },
    createQuiz: async (req, res) => {
        try {
            const options = req.body.options;
            const answer = req.body.answer;
            const token = req.params.token;

            if (!options || !answer || !token) {
                console.log(req.body);
                return res.status(400).json({
                    message: "잘못된 요청",
                });
            }
            const user = await Host.findOne({ where: { token: token } }).then(
                (res) => res.dataValues
            );

            if (!user) {
                return res.status(401).json({
                    message: "유효하지 않은 토큰입니다",
                });
            }

            await Quiz.create({
                option: JSON.stringify(options),
                answer: JSON.stringify(answer),
                HostId: user.id,
            });

            return res.status(200).json({
                message: "사용자 답변 등록 성공",
                data: { name: user.name },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },

    getGuestAnswer: async (req, res) => {
        try {
            const token = req.params.token;

            if (!token) {
                return res.status(401).json({
                    message: "유효하지 않은 토큰입니다",
                });
            }
            const user = await Host.findOne({ where: { token: token } }).then(
                (res) => (res ? res.dataValues : null)
            );
            if (!user) {
                {
                    return res.status(400).json({
                        message: "사용자 조회 실패",
                    });
                }
            }

            const guests = await Guest.findAll({ where: { HostId: user.id } });
            if (!guests) {
                return res.status(200).json({
                    message: "등록된 guest 없음",
                    data: { cookieId: user.cookieId, guests: [] },
                });
            } else {
                return res.status(200).json({
                    message: "guest 조회 성공",
                    data: { cookieId: user.cookieId, guests: guests },
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },
};
