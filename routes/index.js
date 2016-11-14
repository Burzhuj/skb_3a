var express = require('express');
var router = express.Router();
var url = require('url');

/* home page. */
router.all('/', function(req, res/*, next*/) {
  console.log()
  res.render('index', { result:  'Hi'});
});

module.exports = router;
