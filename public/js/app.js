var app = angular.module( 'iceAPP', ['ngRoute'] )

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        }).
        when('/chat', {
            templateUrl: 'views/chat.html',
            controller: 'chatCtrl'
        }).
        when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'adminCtrl'
        }).
        when('/find', {
            templateUrl: 'views/find.html',
            controller: 'findCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);
