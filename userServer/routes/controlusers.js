var express = require('express');
var router = express.Router();
var cors = require('cors');
var mysql = require('mysql');

const auth = require('../lib/auth');

const bcrypt = require('bcrypt');
const saltRounds = 10;


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'userdb'
});

router.get('/',function(req,res){
    res.render('controlusers');

});

router.post('/list',auth,function (req,res){


    var userSelectSql = "SELECT * FROM user";

    //service server
    connection.query(userSelectSql, function(err, results){
        if(err){throw err}
        else {

            res.json(results);

        }
    })

});

module.exports = router;
