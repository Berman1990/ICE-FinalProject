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
        $scope.controls.rotatePalyer();
    }

    $scope.compile = function() {
        $http.post()
    }

});