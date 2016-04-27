angular.module('myApp.stages', [])

  .config( function( $stateProvider) {
    $stateProvider.state('stages', {
      url: '/stages',
      templateUrl: 'components/stages/stages.html',
      controller: 'StagesController',
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

  .controller('StagesController', function($http, $scope) {
    $scope.stages = [];

  	$http.get('api/stages/').success(function (data) {
  		$scope.stages = data;
  	});
  });