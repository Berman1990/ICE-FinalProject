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

    .controller('LevelController', function ($scope, $http) {
        $scope.model = go.Model.fromJson(document.getElementById("mySavedModel").value);

        $scope.model.selectedNodeData = null;

        $scope.model.OverCompile = null;

        // $scope.model

        createjs.EventDispatcher.initialize($scope);
        $scope.stage = new createjs.Stage(document.getElementById("code-player"));

        $scope.controls = {};

        $scope.rotate = function() {
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
            $scope.model.OverCompile = "Do Compile";

            // var error

            for (var j = 0; j < jsonObject.nodeDataArray.length; j++) {

                var NodeKey = jsonObject.nodeDataArray[j].key;
                var NumberOfLink = SumNumberOfLink(jsonObject, NodeKey);

                if (NodeKey === "S") {
                    if (NumberOfLink.from !== 1) {
                        // alert(NodeKey + " error from");
                        $scope.model.highlightNodeByKey(NodeKey);
                        OverCompile = false;
                    }
                }
                else if (NodeKey === "E") {
                    if (NumberOfLink.to !== 1) {
                        // alert(NodeKey + " error to");
                        $scope.model.highlightNodeByKey(NodeKey);
                        OverCompile = false;
                    }
                }
                else if (NodeKey === "K") {
                    if (NumberOfLink.to !== 0 || NumberOfLink.from !== 0) {
                        if (NumberOfLink.to !== 2) {
                            // alert(NodeKey + " Error to");
                            $scope.model.highlightNodeByKey(NodeKey);
                            OverCompile = false;
                        }

                        if (NumberOfLink.from !== 2) {
                            // alert(NodeKey + " Error from");
                            $scope.model.highlightNodeByKey(NodeKey);
                            OverCompile = false;
                        }
                    }
                }
                else {
                    if (NumberOfLink.to !== 0 || NumberOfLink.from !== 0) {
                        if (NumberOfLink.to !== 1) {
                            // alert(NodeKey + " Error to");
                            $scope.model.highlightNodeByKey(NodeKey);
                            OverCompile = false;
                        }

                        if (NumberOfLink.from !== 1) {
                            // alert(NodeKey + " Error from");
                            $scope.model.highlightNodeByKey(NodeKey);
                            OverCompile = false;
                        }
                    }
                }
            }

            $scope.model.OverCompile = OverCompile;
            return OverCompile;
        }

        $scope.compile = function () {
            var jsonObject = JSON.parse($scope.model.getJson());
            doCompile(jsonObject);
        }

        $http.get('api/stages/4').success(function (data) {
            $scope.level = data;
            $scope.controls.ResetGame(data[0], data[0].objects);
        });


    });