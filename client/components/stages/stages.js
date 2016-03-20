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

  .controller('StagesController', function($http) {
  	$http.get('api/stage/all').success(function (data) {
  		console.log(data);
  	});
  });