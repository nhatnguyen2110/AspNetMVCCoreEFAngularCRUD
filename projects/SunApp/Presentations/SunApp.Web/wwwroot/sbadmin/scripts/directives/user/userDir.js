var app = angular.module('sbAdminApp');

app.directive("checkExistedUsername",
    function (UserService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope:
            {
                skipUserId: "=userid"
            },
            link: function (scope, element, attrs, ngModel) {
                element.on('blur', function (evt) {

                    if (!ngModel || !element.val()) return;
                    var curValue = element.val();

                    UserService.checkExistedUsername(curValue, scope.skipUserId)
                        .then(function (response) {
                            ngModel.$setValidity('uniqueusername', !response.data);
                        }, function () {
                            //If there is an error while executing AJAX
                            ngModel.$setValidity('uniqueusername', true);
                        });
                });
            }
        };
    }
);