var express = require('express');
var router = express.Router();

var dbCon = require('../module/db/con');

var dotenv=require('dotenv').config();

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
