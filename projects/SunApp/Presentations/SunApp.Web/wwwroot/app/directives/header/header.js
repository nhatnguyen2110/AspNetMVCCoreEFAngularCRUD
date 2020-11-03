angular.module('MyApp')
    .directive('header', function () {
        return {
            templateUrl: 'app/directives/header/header.html',
            restrict: 'E',
            replace: true,
        }
    });