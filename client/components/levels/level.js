angular.module('myApp.level', [])

  .config( function( $stateProvider) {
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

  .controller('LevelController', function() {
  });