var app = angular.module('sbAdminApp');
app.controller('loginCtrl', function ($scope, $state, $localStorage, $http, UserService) {
    $scope.userName = "";
    $scope.password = "";
    $scope.message = "";
    $scope.login = function () {
        var loginResult = UserService.login($scope.userName, $scope.password);
        loginResult.then(function (resp) {
            if (resp.data.token) {
                var userid = resp.data.claims.filter(function (o) {
                    return o.type == 'nameid';
                });
                var username = resp.data.claims.filter(function (o) {
                    return o.type == 'sub';
                });
                var fullname = resp.data.claims.filter(function (o) {
                    return o.type == 'given_name';
                });
                var imgurl = resp.data.claims.filter(function (o) {
                    return o.type == 'website';
                });
                var email = resp.data.claims.filter(function (o) {
                    return o.type == 'email';
                });
                $localStorage.currentUser = {
                    username: (username ? username[0].value : null),
                    token: resp.data.token,
                    userid: (userid ? userid[0].value : null),
                    fullname: (fullname ? fullname[0].value : null),
                    imgurl: (imgurl ? imgurl[0].value : null),
                    email: (email ? email[0].value : null)
                };
                // add jwt token to auth header for all request made by the $http service
                $http.defaults.headers.common.Authorization = "Bear " + resp.data.token;
                $state.go("dashboard.home");
            }

        }, function (response) {
            $scope.message = response.data;
        });

    };

});