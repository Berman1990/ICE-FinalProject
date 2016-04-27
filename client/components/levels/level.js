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

.controller('LevelController', function($scope, $http) {
    $scope.model = go.Model.fromJson(document.getElementById("mySavedModel").value);

    $scope.model.selectedNodeData = null;

    // $scope.model

    createjs.EventDispatcher.initialize($scope);
    $scope.stage = new createjs.Stage(document.getElementById("code-player"));

    $scope.controls = {};

    $scope.rotate = function() {
        $scope.controls.setCommandArray([3,1,1,1,1,1]);
    }

    $scope.compile = function() {
        var jsonObject = JSON.parse($scope.model.getJson());

        $http.post('api/stages/compile', jsonObject).success(function(data) {

        });
    }

    $http.get('api/stages/4').success(function (data) {
        $scope.level = data;
        $scope.controls.ResetGame(data[0],data[0].objects);
    });


});