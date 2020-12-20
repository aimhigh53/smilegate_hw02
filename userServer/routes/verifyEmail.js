var express = require('express');
var router = express.Router();
var cors = require('cors');
var mysql = require('mysql');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var redis = require("redis");

const REDIS_PORT=process.env.REDIS_PORT
const HOST=process.env.HOST


const client = redis.createClient(REDIS_PORT,HOST);

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'ehfwkd53',
    database : 'userdb'
});

connection.connect();

router.use(cors());

router.get('/', function(req, res, next) {
    res.render('verifyEmail');
});



router.post('/',function (req,res){

        var userEmail=req.body.userEmail;
        var userName="";
        var insertUserSql= "INSERT INTO user (`name`, `email`,`password`) VALUES (?, ?, ?)"
        var userPassword="";


        client.hmget(userEmail,"userName","userPassword",function (err,obj){
            if(err){
                console.log(err);
                res.json(0);
            }else {

                userName = obj[0];
                userPassword = obj[1];
            }
        });

        const promise= new Promise(((resolve, reject) => {
            bcrypt.genSalt(saltRounds,(err,salt)=>{
                if(err)throw err;

                bcrypt.hash(userPassword,salt,(err,hash)=>{
                    if(err)throw err;
                    else{
                        userPassword=hash;

                        setTimeout(()=>{
                            resolve([userPassword,salt]);
                        },100)
                    }
                });
            });
          }));

        promise.then(value => {
            connection.query(insertUserSql, [userName, userEmail, value[0]], function (error, results, fields) {
                if (error) {
                    throw error;
                    res.json(0);
                } else {
                    res.json(1);
                }
            });
        })


});
//
// router.post('/findpassword',function (req,res){
//
//     var userEmail=req.body.userEmail;
//     var getUserSql= "SELECT * FROM user WHERE email=(?)"
//
//     connection.query(getUserSql,[userEmail],function (error,results,field){
//         if(error){
//             console.log(error);
//             throw error;
//         }
//         try{
//             if (results.length===0){
//                 res.json(0);
//             }else{
//                 res.json(1);
//             }
//         }catch (error){
//             console.log(error);
//         }
//
//
//     });
//
//
//
// });





module.exports = router;
