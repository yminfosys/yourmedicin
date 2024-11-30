var express = require('express');
var router = express.Router();

var dbCon = require('../module/db/con');
var db=require('../module/db/bdModule')
var auto_incriment=require('../module/db/autoIncriment');
var smsotp = require('../module/smsotp');
var dotenv=require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;





////Randanm OTP/////////
function randamNumber() {
  var tex = "";
  for (var i = 0; i < 4; i++) {
      tex += '' + Math.floor(Math.random() * 10) + '';
  }
  return tex;

}

/* GET users listing. */
router.get('/', async function(req, res, next) {
  //res.clearCookie("userID");
  await dbCon.connectDB()
  const city= await db.city.find({})
  await dbCon.closeDB();
  var allredylogin=req.cookies.userID
  res.render('user/user',{YOUR_API_KEY: process.env.API_KEY,city:city,allredylogin:allredylogin})
  
});



router.post('/checkuserexist', async function(req, res, next) {
  await dbCon.connectDB()

  const user= await db.user.findOne({mobile:req.body.mobile})

  await dbCon.closeDB();
  res.json(user)

})





router.post('/newuser', async function(req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    auto_incriment.auto_incriment("userID").then(async function(inc_val){
      await dbCon.connectDB()
    const user= await db.user({
      userName:req.body.userName,
      userID:inc_val,
      email:req.body.email,
      password:hash,
      mobile:req.body.mobile,
      reffrom:req.body.reffrom,
      refby:req.body.refby,
      otp:req.body.otp,
      city:req.body.city,
      country:req.body.country,
      state:req.body.state,
      address:"",
      postCode:""
    })
  
    await user.save();
  
    await dbCon.closeDB();
    res.json(user)
  
    })

  });
});

router.post('/userlogin', async function(req, res, next) {
  await dbCon.connectDB()
  const user= await db.user.findOne({mobile:req.body.mobile});
  await dbCon.closeDB();
  bcrypt.compare(req.body.psw,user.password, async function(err,match){
    if(match){
      res.cookie("userID", user.userID, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    res.send(match);
  })

})



///////////OTP////////////
router.post('/otpSend', function(req, res, next) {
  var otp=randamNumber()
  smsotp.otpsend({
          apikey: process.env.OTP2KEY,
          mobileno: "+91" + req.body.mobile + "",
          otp: otp
      }, function(data) {
          // console.log(data);
          res.send({data:data,otp:otp});
      })
      
});


//////////EMAIL SEND/////////////
const nodemailer = require("nodemailer");

router.post('/emailSend', async function(req, res, next) {
  var otp=randamNumber()

  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "sukanta.uk@gmail.com", // generated ethereal user
      pass: "QK4jNkhxFm3ARDaw", // generated ethereal password
    }
    })

    let info = await transporter.sendMail({
      from: 'info@naesoft.in', // sender address
      to: req.body.emailaddress, // list of receivers
      subject: "PAA MOTO OTP", // Subject line
      //text: "Hello world?", // plain text body
      html: '<body><h1>Paa Moto Otp is</h1><h1>'+otp+'</h1><p>Use this OTP to verify Password Change</p>', // html body
    });

    res.send({email:info.messageId,otp:otp});
  
      
});






module.exports = router;
