var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mysql      = require('mysql');
var Isemail = require('isemail');
var cookie = require('cookie');

require('dotenv').config();


const bcrypt = require('bcrypt');
const redis = require("redis");

const SECRET_ACCESS_TOKEN=process.env.ACCESS_SECRET;
const SECRET_REFRESH_TOKEN=process.env.REFRESH_SECRET;

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signin');
});


router.post('/',function (req,res){
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;

  var searchEmailSql = "SELECT * FROM user WHERE email = ?";

  connection.query(searchEmailSql,[userEmail, userPassword], function (error, results, fields) {
    if(results.length==0){res.json(0)}
    else {
        var hash = results[0].password;
        var userName=results[0].name;


        var setToken = async function (key,token) {


            await client.hmset(key,'refreshToken',token,function (err,reply){
                if(err){
                    console.log(err)
                    res.json(0);
                }else{
                    console.log(typeof key+""+typeof userEmail+""+typeof token);
                    console.log(reply)
                }
            });
              await client.setex(key+':refreshToken',1000 * 60 * 60 * 24 * 7,'sthval',function (err,reply){
                if(err){
                  console.log(err)
                  res.json(0);
                }else{
                  console.log(reply)
                }

            });
        }

        bcrypt.compare(userPassword, hash)
            .then(async function (result) {

                const ismember = await result;

                if (ismember != true) {
                    res.json(0)
                } else {
                    const accesstoken = jwt.sign(
                        {
                            userEmail: results[0].email,
                        }, SECRET_ACCESS_TOKEN,
                        {
                            expiresIn:'30m',
                                //for test'2s',
                                //
                        }
                    );
                    const refreshtoken = jwt.sign(
                        {
                            userEmail: results[0].email,
                        }, SECRET_REFRESH_TOKEN,
                        {
                            expiresIn: '7d',
                        }
                    );
                    //
                    setToken(userEmail,accesstoken)

                    res.cookie('x_access_token', accesstoken, {
                        maxAge: 1000 * 60 * 30, // maintain 30min
                        // for test maxAge:1000*30*,//maintain 10sec
                        httpOnly: true,
                    });
                    res.cookie('x_refresh_token', refreshtoken, {
                        maxAge: 1000 * 60 * 60 * 24 * 7, // maintain 7 days
                        httpOnly: true,
                    });


                    res.json(1)
                }
            });

            }

      });

    });

module.exports = router;
