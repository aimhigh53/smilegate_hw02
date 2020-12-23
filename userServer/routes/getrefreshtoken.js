var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql = require('mysql');

require('dotenv').config();

const SECRET_ACCESS_TOKEN=process.env.ACCESS_SECRET;

const auth = require('../lib/auth');
const redis = require("redis");

const REDIS_PORT=process.env.REDIS_PORT;
const HOST=process.env.HOST;

const client = redis.createClient(REDIS_PORT,HOST);


router.get('/',function (req,res){
    var statuscode=req.query.status;
    var userEmail=req.query.userEmail;
    var refreshtoken='';

    if (statuscode!=419){
        res.json(0)
    }else{
        try{
            const promise= new Promise(((resolve, reject) => {
                client.hmget(userEmail, "refreshToken", function (err, obj) {
                    if (err) {
                        console.log(err);
                    } else {
                        refreshtoken = obj[0];
                        setTimeout(()=>{
                            resolve(refreshtoken);
                        },100)
                    }
                });
            }));

            promise.then(value => {
                if(value.length===0){
                    res.json(0)
                }else{
                    const accesstoken=jwt.sign(
                        {
                            userEmail: userEmail,
                        }, SECRET_ACCESS_TOKEN,
                        {
                            expiresIn: '30m',
                        }
                    );
                    res.cookie('x_access_token', accesstoken, {
                        maxAge: 1000 * 60 * 30, // maintain 30min
                        // maxAge:1000*30*,//maintain 10sec
                        httpOnly: true,
                    });
                    res.json(1)
                }
            })
        }catch (err){
            console.log(err);
        }
    }


    // var userEmail=req.query.userEmail;

    //
    // const promise= new Promise(((resolve, reject) => {
    //     client.hmget(userEmail, "refreshToken", function (err, obj) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             refreshtoken = obj[0];
    //             setTimeout(()=>{
    //                 resolve(refreshtoken);
    //             },100)
    //         }
    //     });
    // }));
    //
    // promise.then(value => {
    //     if(value.length===0){
    //         res.json(0)
    //     }else{
    //         const accesstoken=jwt.sign(
    //             {
    //                 userEmail: userEmail,
    //             }, SECRET_ACCESS_TOKEN,
    //             {
    //                 expiresIn: '30m',
    //             }
    //         );
    //         res.cookie('x_access_token', accesstoken, {
    //             maxAge: 1000 * 60 * 30, // maintain 30min
    //             // maxAge:1000*30*,//maintain 10sec
    //             httpOnly: true,
    //         });
    //         res.json(1)
    //     }
    //
    // })

});




// router.get('/findpassword',auth,function (req,res){
//     res.json(1);
// });

module.exports = router;
