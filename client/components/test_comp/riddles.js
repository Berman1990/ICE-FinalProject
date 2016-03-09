angular.module('myApp.riddles', [])

  .config( function( $stateProvider) {
    $stateProvider.state('riddles', {
      url: '/riddles',
      templateUrl: 'components/test_comp/riddles.html',
      controller: 'RiddleController',
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
    });
  })

  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/users/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/users/me', profileData);
      }
    };
  })

  .controller('RiddleController', function ($scope, $auth, $mdToast, Account) {


    Account.getProfile().success(function (data) {


      $scope.test = data;
    });
    console.log($scope.test);

  });