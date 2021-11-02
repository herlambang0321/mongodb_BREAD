var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'BREAD(Browse, Read, Edit, Add, Delete)' });
// });

router.get('/', function(req, res, next) {
  res.render('jquery');
});

module.exports = router;
