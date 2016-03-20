var express = require('express');
var router = express.Router();

var auth = require('../../auth/auth.service');
var Stage = require('./stage.model');
var User = require('../user/user.model')

function validationError(res, err) {
  res.status(422).json(err);
}


/*
* Return all stages
* */
router.get('/all', auth.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});


module.exports = router;