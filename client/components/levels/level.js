angular.module('myApp.level', ['myApp.level.chart', 'myApp.level.player'])

    .config(function ($stateProvider) {
        $stateProvider.state('level', {
            url: '/level',
            templateUrl: 'components/levels/level.html',
            controller: 'LevelController',
            resolve: {
                authenticated: function ($q, $location, $auth) {
                    var deferred = $q.defer();

                    if (!$auth.isAuthenticated()) {
                        $location.path('/login');
                    } else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }
            }
        })
    })

    .controller('LevelController', function ($scope, $http, $stateParams) {
        $scope.model = go.Model.fromJson(document.getElementById("mySavedModel").value);

        $scope.model.selectedNodeData = null;

        $scope.model.OverCompile = null;

        var stageId = $stateParams.levelNum;

        // $scope.model

        createjs.EventDispatcher.initialize($scope);
        $scope.stage = new createjs.Stage(document.getElementById("code-player"));

        $scope.controls = {};

        $scope.rotate = function () {
            $scope.model.highlightNodeByKey("S");
        }

        $scope.run = function () {
            var jsonObject = JSON.parse($scope.model.getJson());
            if (doCompile(jsonObject)) {
                $http.post('api/stages/compile', jsonObject).success(function (data) {
                    $scope.controls.setCommandArray(data);
                });
            }
        }

        $scope.reset = function () {
            $scope.controls.ResetGame();
            }

        function SumNumberOfLink(jsonObject, NoedKey) {
            var res = new Object();

            res.to = 0;
            res.from = 0;

            for (var i = 0; i < jsonObject.linkDataArray.length; i++) {
                if (jsonObject.linkDataArray[i].from === NoedKey) {
                    res.from++;
                }
                if (jsonObject.linkDataArray[i].to === NoedKey) {
                    res.to++;
                }
            }

            return (res);
        }

        function doCompile(jsonObject) {

            var OverCompile = true;

            var errorArray = [];

            for (var j = 0; j < jsonObject.nodeDataArray.length; j++) {

                var NodeKey = jsonObject.nodeDataArray[j].key;
                var NumberOfLink = SumNumberOfLink(jsonObject, NodeKey);

                if (NodeKey === "S") {
                    if (NumberOfLink.from !== 1) {
                        $scope.model.highlightNodeByKey(NodeKey, false);
                        OverCompile = false;

                        var errorObject = new Object();
                        errorObject.id = NodeKey;

                        if (NumberOfLink.from > 1) {
                            errorObject.name = "Error: More Then One Output from the start";
                        }
                        else {
                            errorObject.name = "Error: Less Then One Output from the start";
                        }

                        errorArray.push(errorObject);
                    }
                }
                else if (NodeKey === "E") {
                    if (NumberOfLink.to !== 1) {
                        $scope.model.highlightNodeByKey(NodeKey, false);
                        OverCompile = false;

                        var errorObject = new Object();
                        errorObject.id = NodeKey;

                        if (NumberOfLink.to > 1) {
                            errorObject.name = "Error: More Then One Input to the end";
                        }
                        else {
                            errorObject.name = "Error: Less Then One Input to the end";
                        }

                        errorArray.push(errorObject);
                    }
                }
                else if (NodeKey === "K") {
                    if (NumberOfLink.to !== 0 || NumberOfLink.from !== 0) {
                        if (NumberOfLink.to !== 2) {
                            $scope.model.highlightNodeByKey(NodeKey, false);
                            OverCompile = false;

                            var errorObject = new Object();
                            errorObject.id = NodeKey;

                            if (NumberOfLink.to > 2) {
                                errorObject.name = "Error: More Then Two Input to the loop";
                            }
                            else {
                                errorObject.name = "Error: Less Then Two Input to the loop";
                            }

                            errorArray.push(errorObject);
                        }

                        if (NumberOfLink.from !== 2) {
                            $scope.model.highlightNodeByKey(NodeKey, false);
                            OverCompile = false;

                            var errorObject = new Object();
                            errorObject.id = NodeKey;

                            if (NumberOfLink.from > 2) {
                                errorObject.name = "Error: More Then Two Output from the loop";
                            }
                            else {
                                errorObject.name = "Error: Less Then Two Output from the loop";
                            }

                            errorArray.push(errorObject);
                        }
                    }
                }
                else {
                    if (NumberOfLink.to !== 0 || NumberOfLink.from !== 0) {

                        var keyName;
                        if (NodeKey === "F") {
                            keyName = "Step";
                        }
                        else if (NodeKey === "R") {
                            keyName = "Right";
                        }
                        else if (NodeKey === "L") {
                            keyName = "Left";
                        }

                        if (NumberOfLink.to !== 1) {
                            $scope.model.highlightNodeByKey(NodeKey, false);
                            OverCompile = false;

                            var errorObject = new Object();
                            errorObject.id = NodeKey;

                            if (NumberOfLink.to > 1) {
                                errorObject.name = "Error: More Then One Input to the " + keyName;
                            }
                            else {
                                errorObject.name = "Error: Less Then One Input to the " + keyName;
                            }

                            errorArray.push(errorObject);
                        }

                        if (NumberOfLink.from !== 1) {
                            $scope.model.highlightNodeByKey(NodeKey, false);
                            OverCompile = false;

                            var errorObject = new Object();
                            errorObject.id = NodeKey;

                            if (NumberOfLink.from > 1) {
                                errorObject.name = "Error: More Then One Output from the " + keyName;
                            }
                            else {
                                errorObject.name = "Error: Less Then One Output from the " + keyName;
                            }

                            errorArray.push(errorObject);
                        }
                    }
                }
            }

            $scope.$watch('data.repeatSelect', function (repeatSelect) {
                if (repeatSelect !== undefined && repeatSelect !== null) {
                    for (var i = 0; i < repeatSelect.length; i++) {
                        if (i === 0) {
                            $scope.model.highlightNodeByKey(repeatSelect[i], true);
                        }
                        else {
                            $scope.model.highlightNodeByKey(repeatSelect[i], false);
                        }
                    }
                }
            });

            if (OverCompile) {
                var errorObject = new Object();
                errorObject.id = NodeKey;
                errorObject.name = "No Error :)";

                errorArray.push(errorObject);

                $scope.selectStyle = {
                    "color": "green"
                }
            }
            else {
                $scope.selectStyle = {
                    "color": "red"
                }
            }


            $scope.data = {
                repeatSelect: null,
                availableOptions: errorArray,
            };

            return OverCompile;
        }

        $scope.compile = function () {
            var jsonObject = JSON.parse($scope.model.getJson());
            doCompile(jsonObject);
        }

        $http.get('api/stages/3').success(function (data) {
            $scope.level = data;
            $scope.controls.InitGame(data[0], data[0].objects);
        });
    });