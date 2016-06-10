angular.module('myApp.logout', [])

  .config( function( $stateProvider) {
    $stateProvider.state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutController'
    })
  })

  .controller('LogoutController', function($auth, $mdToast, $window) {
    if (!$auth.isAuthenticated()) {
      return;
    }
    $auth.logout()
      .then(function() {
        $mdToast.show(
          $mdToast.simple()
            .content('You have been logged out')
            .position('bottom right')
            .hideDelay(3000)
        );
          $window.location.href = '/';
      });
  });
