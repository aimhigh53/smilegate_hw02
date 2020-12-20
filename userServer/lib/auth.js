const jwt = require("jsonwebtoken");
require('dotenv').config();

const ACCESS_TOKEN=process.env.ACCESS_SECRET;

var cookies = require('cookies');


const authMiddleware = (req, res, next) => {
    // const token = req.headers["ourtoken"] || req.query.token;
    let token=req.cookies.x_access_token;

    console.error(token);
    if (!token) {
        return res.status(403).json({
            server: "smailgate_devcamp",
            success: false,
            message: "로그인페이지에서 로그인 후 진행해주세요!",
        });
    }
    const promise = new Promise((resolve, reject) => {
        jwt.verify(token, ACCESS_TOKEN, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });

    const onError = (error) => {

        if (error.name==='TokenExpiredError'){
            res.status(419).json({
                server: "smailgate_devcamp",
                success: false,
                message: error.message,
            })
        }
        else {
            console.log(error);
            res.status(403).json({
                server: "smailgate_devcamp",
                success: false,
                message: error.message,
            });
        }
    };
    promise.then((decoded) => {

        req.decoded = decoded;
        next();
    }).catch(onError);
};
module.exports = authMiddleware;