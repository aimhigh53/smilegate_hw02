var express = require('express');
var router = express.Router();
var Isemail = require('isemail');
var cors = require('cors');
var mysql      = require('mysql');
var todayEnd = new Date().setHours(23, 59, 59, 999);


const saltRounds = 10;
const redis = require("redis");
const bcrypt = require('bcrypt');

const REDIS_PORT=process.env.REDIS_PORT
const HOST=process.env.HOST

const client = redis.createClient(REDIS_PORT,HOST);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'userdb'
});

connection.connect();


router.use(cors());

router.get('/',function (req,res){
  res.render('refactorpassword');
});

router.post('/',function (req,res){


  var userPassword = req.body.userPassword;
  var userEmail = req.body.userEmail;
  var updateUserSql= "UPDATE user SET password=? WHERE email=?"
  console.log(userPassword,userEmail);

  const promise= new Promise(((resolve, reject) => {
    bcrypt.genSalt(saltRounds,(err,salt)=>{
      if(err)throw err;

      bcrypt.hash(userPassword,salt,(err,hash)=>{
        if(err)throw err;
        else{
          userPassword=hash;
          console.log(userPassword)

          setTimeout(()=>{
            resolve(userPassword);
          },10)
        }
      });
    });
  }));

  promise.then(value => {
    connection.query(updateUserSql,[value,userEmail], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
        res.json(0);
      } else {
        res.json(1);
      }
    });
  })



});




module.exports = router;
