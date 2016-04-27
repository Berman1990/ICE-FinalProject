var express = require('express');
var router = express.Router();

var auth = require('../../auth/auth.service');
var Stage = require('./stage.model');

function validationError(res, err) {
  res.status(422).json(err);
}

/*
* Return all stages
* */
router.get('/',  function(req, res, next) {
  var query = Stage.find({}).select({ "id" : 1,"name": 1,"difficulty" : 1, "description": 1, "_id": 0});

  query.exec(function (err, stages) {
    if (err) return next(err);
    res.send(stages);
  });
});


/*
 * Return stage by Id
 * */
router.get('/:stageId', function(req, res) {
  Stage.find({"id" : req.param('stageId')},function(err, stage) {
    res.send(stage);
  });
});

module.exports = router;