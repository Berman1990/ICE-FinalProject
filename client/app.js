angular.module('myApp', [
  'ngResource',
  'ngMessages',
  'ngMaterial',
  'ui.router',
  'satellizer',

  'myApp.navbar',
  'myApp.passwordMatch',

  'myApp.signup',
  'myApp.profile',
  'myApp.login',
  'myApp.password',
  'myApp.logout',
  'myApp.home',
  'myApp.level',
  'myApp.level.chart',
  'myApp.level.player',
  'myApp.stages',
  'myApp.stage',
])

  .config(function($stateProvider, $mdThemingProvider, $urlRouterProvider, $authProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('grey');

    $urlRouterProvider.otherwise('/home');

      //$stateProvider
      //    .state('level', {
      //        url: 'level/:levelNum',
      //        params: {
      //            levelNum: {
      //                value: '0'
      //            }
      //        }
      //    });


    $authProvider.facebook({
      clientId: '1446453645668626'
    });

    $authProvider.google({
      clientId: '676415535841-8l6ej784svt61062gmqo613pb89qqcin.apps.googleusercontent.com'
    });

  });
