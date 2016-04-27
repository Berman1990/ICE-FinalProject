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
router.get('/', function (req, res, next) {
    var query = Stage.find({}).select({"id": 1, "name": 1, "difficulty": 1, "description": 1, "_id": 0});

    query.exec(function (err, stages) {
        if (err) return next(err);
        res.send(stages);
    });
});

router.post('/compile', function (req, res) {
    var graph = req.body;

    var commandsArray = [];

    var currentNode = _.findWhere(graph.linkDataArray, {from: "S"});

    readGraph(currentNode, "E");

    function readGraph(currentNode, stop) {

        if (currentNode.to[0] === "F") {
            commandsArray.push(1);
        }
        else if (currentNode.to[0] === "R") {
            commandsArray.push(2);
        }
        else if (currentNode.to[0] === "L") {
            commandsArray.push(3);
        }
        else if (currentNode.to[0] === "K" && stop !== currentNode.to) {

            var loopNode = _.findWhere(graph.linkDataArray, {from: currentNode.to, fromPort: "R"});
            var i;
            for (i = 0; i < 2; i++) {
                readGraph(loopNode, currentNode.to);
            }

        }

        if (currentNode.to !== stop) {

            readGraph(_.findWhere(graph.linkDataArray, {from: currentNode.to, fromPort: "B"}),stop);
        }

    }


    res.send(commandsArray);

})
;


/*
 * Return stage by Id
 * */
router.get('/:stageId', function (req, res) {
    Stage.find({"id": req.param('stageId')}, function (err, stage) {
        res.send(stage);
    });
});

module.exports = router;
