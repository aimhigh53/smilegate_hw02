var express = require('express');
var router = express.Router();
var Isemail = require('isemail');
var cors = require('cors');
var mysql      = require('mysql');
var todayEnd = new Date().setHours(23, 59, 59, 999);

const redis = require("redis");

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
  res.render('signup');
});
router.get('/findpassword',function (req,res){
  res.json(1)
});


router.get('/overlapcheck',function (req,res){

  var userEmail = req.query.userEmail;
  var searchUserSql= "SELECT * from user where email=?"

  console.log(userEmail);

  connection.query(searchUserSql,userEmail, function (error, results, fields) {
    if (error){
      throw error;
    }
    else{

      if (results.length==0){
        if(Isemail.validate(userEmail)) {
          res.json(1);
        }else {
          res.json(2);
        }
      }else{
        res.json(0)
      }

    }
  });

});


router.post('/',function (req,res){
  var userName = req.body.userName;
  var userPassword = req.body.userPassword;
  var userEmail = req.body.userEmail;

  var setObject = async function (key,obj1,obj2,obj3) {

    console.log(key,obj1,obj2);


    await client.hset(key,'userName',obj1,'userEmail',obj2,'userPassword',obj3,function (err,reply){
      if(err){
        console.log(err)
        res.json(0);
      }else{
        console.log(typeof(''+userEmail)+""+typeof obj1+""+typeof obj2+""+typeof obj3);
        console.log(reply)
      }
    });
    //set expire date
      await client.setex(''+userEmail,1000 * 60 * 60 * 24 * 7,'refreshToken',function (err,reply){
        if(err){
          console.log(err)
          res.json(0);
        }else{
          console.log(reply)
        }

    });
  }

  setObject(userEmail,userName,userEmail,userPassword)

  res.json(1);


});




module.exports = router;
