var express = require('express');
var router = express.Router();
var cors = require('cors');
var mysql = require('mysql');

const bcrypt = require('bcrypt');


var redis = require("redis-mock");

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

router.get('/', function(req, res, next) {
    res.render('findpassword');
});



router.post('/',function (req,res){

    var userEmail=req.body.userEmail;
    var getUserSql= "SELECT * FROM user WHERE email=(?)"

    connection.query(getUserSql,[userEmail],function (error,results,field){
        if(error){
            console.log(error);
            throw error;
        }
        try{
            if (results.length===0){
                res.json(0);
            }else{
                res.json(1);
            }
        }catch (error){
            console.log(error);
        }


    });



});


module.exports = router;
