angular.module('myApp.navbar', [])
  .controller('NavbarController', function($rootScope, $auth) {
    $rootScope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
  });