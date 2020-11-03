'use strict';

angular.module('sbAdminApp')
    .directive('headerNotification', function () {
        return {
            templateUrl: 'sbadmin/scripts/directives/header/header-notification/header-notification.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope, UserService) {
                $scope.logout = function () {
                    UserService.logout();
                    //alert('logout');
                };
            }
        }
    });


