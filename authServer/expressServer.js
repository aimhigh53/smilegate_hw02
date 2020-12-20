require("dotenv").config()

const express = require('express')
const request = require('request');
var jwt = require('jsonwebtoken');
var Isemail = require('isemail');
var cors = require('cors');


const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


// const auth = require('./lib/auth');

const app = express()


// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'ehfwkd53',
//     database : 'fintech'
// });

// connection.connect();

app.set('views',__dirname+'/views'); //렌더링할 파일이 있는 디렉토리
app.set('view engine','ejs');//사용하는 뷰 엔진

app.use(cors());
app.use(express.json()); // JSON 타입의 데이터를 받기위한 설정
app.use(express.urlencoded({ extended: false })); // urlencoded 타입의 데이터를 받기위한 설정


app.use(express.static(__dirname+'/public'));//디자인 파일이 위치할 정적 요소들을 저장하는 디렉토리

//이메일 인증
//이메일 아이디 기반으로 이메일 날리고, 인증코드랑 매칭 뒤 완료

app.post('/verifyemail',async (req, res) => {

    var userEmail =req.body.userEmail;


    if(!Isemail.validate(userEmail)){
        res.json(0)
    }
    else {
        console.log(userEmail);

        let authNum = Math.random().toString().substr(2,6);

        const smtpTransport = nodemailer.createTransport({
           service:'Naver',
           host:'smpt.naver.com',
           port:465,
           auth: {
             user: process.env.NODEMAILER_USER,
             pass: process.env.NODEMAILER_PASS
           }
        });
        const mailOptions={
            from: process.env.NODEMAILER_USER,
            to: userEmail,
            subject: 'Sending Email using Node.js[nodemailer]',
            text: authNum,
            html: `<b>${authNum}</b>`,
        }
        await smtpTransport.sendMail(mailOptions, (error, responses) =>{
            if(error){
              res.json(0)
            }else{
                //for test
                // res.json(authNum)
                res.json(1);
            }
            smtpTransport.close();

        });
        // res.sendStatus(200)

    }

});





app.listen(10010,function(){
    console.log('서버가 10010번을 사용중입니다.')
});
