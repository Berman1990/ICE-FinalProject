angular.module('myApp.level', ['myApp.level.chart', 'myApp.level.player'])

.config(function($stateProvider) {
    $stateProvider.state('level', {
        url: '/level',
        templateUrl: 'components/levels/level.html',
        controller: 'LevelController',
        resolve: {
            authenticated: function($q, $location, $auth) {
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

.controller('LevelController', function($scope) {
    $scope.model = go.Model.fromJson(document.getElementById("mySavedModel").value);

    $scope.model.selectedNodeData = null;

    createjs.EventDispatcher.initialize($scope);
    $scope.stage = new createjs.Stage(document.getElementById("code-player"));

    $scope.controls = {};

    $scope.rotate = function() {

        var wall = new Object();
        var startPnt = new Object();
        startPnt.x =0;
        startPnt.y =200;
        var endPnt = new Object();
        endPnt.x=50;
        endPnt.y=200;
        wall.startPnt = startPnt;
        wall.endPnt = endPnt;


        var wall2 = new Object();
        var startPnt2 = new Object();
        startPnt2.x =400;
        startPnt2.y =0;
        var endPnt2 = new Object();
        endPnt2.x=400;
        endPnt2.y=200;
        wall2.startPnt = startPnt2;
        wall2.endPnt = endPnt2;
        $scope.controls.DrawWalls([wall,wall2]);

        //$scope.controls.setCommandArray([2,1,2,1,2,1,2,1]);
        $scope.controls.setCommandArray([2,2,1,1,1,1,1,1,1,1,1]);
    }



    $scope.compile = function() {
        $http.post()
    }

});