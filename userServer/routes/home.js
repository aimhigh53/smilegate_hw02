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

const bcrypt = require('bcrypt');


router.get('/',auth,function(req, res, next) {
    res.render('home');
});

router.get('/controlusers',auth,function (req,res){
    console.log(req);
    console.log(res);


    res.json(1);
});


router.get('/logout',async function (req,res) {

    //make blacklist through redis...
    //do lpush,,

    res.clearCookie('x_access_token')
    res.clearCookie('x_refresh_token');

    res.json(1)

});



module.exports = router;
