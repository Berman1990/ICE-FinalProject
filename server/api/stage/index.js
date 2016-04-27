var express = require('express');
var _ = require("underscore");
var router = express.Router();

var auth = require('../../auth/auth.service');
var Stage = require('./stage.model');

function validationError(res, err) {
    res.status(422).json(err);
}

/*
 * Return all stages
 * */
router.get('/', function(req, res, next) {
    var query = Stage.find({}).select({ "id": 1, "name": 1, "difficulty": 1, "description": 1, "_id": 0 });

    query.exec(function(err, stages) {
        if (err) return next(err);
        res.send(stages);
    });
});

router.post('/compile', function(req, res) {
    var graph = req.body;

    var commandsArray = [];

    var tempNode = {};


    var currentNode = _.findWhere(graph.linkDataArray, {from: "S"});

    while (currentNode.to === "E") {

      if(currentNode[0] === "F") {
        commandsArray.push(1);
      }
      else if (currentNode[0] === "R") {
        commandsArray.push(2);
      }
      else if (currentNode[0] === "L") {
        commandsArray.push(3);
      }

      currentNode = _.findWhere(graph.linkDataArray, {from: currentNode.to});

    }



});


/*
 * Return stage by Id
 * */
router.get('/:stageId', function(req, res) {
    Stage.find({ "id": req.param('stageId') }, function(err, stage) {
        res.send(stage);
    });
});

module.exports = router;
