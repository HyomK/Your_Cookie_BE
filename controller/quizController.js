const { Host, Quiz, Guest } = require("../models");

module.exports = {
    getHostQuiz: async (req, res) => {
        try {
            const token = req.params.token;
            const guestName = req.body.name;

            if (!token) {
                console.log(req.params);
                return res.status(400).json({
                    message: "잘못된 요청",
                });
            }

            const user = await Host.findOne({ where: { token: token } }).then(
                (res) => {
                    if (res) {
                        return res.dataValues;
                    } else return null;
                }
            );

            if (!user) {
                return res.status(401).json({
                    message: "유효하지 않은 토큰입니다",
                });
            }

            const cookieId = user.cookieId;
            const quiz = await Quiz.findOne({ where: { HostId: user.id } });
            const options = JSON.parse(quiz.option);
            const answer = JSON.parse(quiz.answer);

            return res.status(200).json({
                message: "사용자 질문 조회 성공",
                data: {
                    name: user.name,
                    cookieId: cookieId,
                    options: options,
                    answer: answer,
                },
            });
            //TODO 질문 반환
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
        }
    },

    registerGuest: async (req, res) => {
        try {
            const guestName = req.body.guestName;
            const score = req.body.score;
            const comment = req.body.comment;
            const answer = req.body.answer;
            const token = req.body.token;

            if (!token || !guestName || !score) {
                return res.status(400).json({
                    message: "잘못된 요청",
                });
            }

            const user = await Host.findOne({ where: { token: token } }).then(
                (res) => res
            );

            if (!user) {
                return res.status(401).json({
                    message: "유효하지 않은 토큰입니다",
                });
            }

            await Guest.create({
                name: guestName,
                comment: comment,
                score: score,
                answer: answer,
                HostId: user.dataValues.id,
            }).catch((error) => {
                console.log(error);
            });
            return res.status(200).json({
                message: "게스트 등록 성공",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    },
};
