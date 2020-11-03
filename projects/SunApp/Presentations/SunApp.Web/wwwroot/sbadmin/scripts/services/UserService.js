angular.module('sbAdminApp').factory('UserService', function ($q, $http, $localStorage) {
    var userService = {};

    // Get User by Id
    userService.userDetail = function (id) {
        var deferred = $q.defer();
        $http.get("api/user/detail/" + id)
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(response.data);

            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
            });

        return deferred.promise;
    }
    // Get new User
    userService.newUser = function () {
        var deferred = $q.defer();
        $http.get("api/user/new")
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(response.data);

            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
            });

        return deferred.promise;
    }
    // Save User
    userService.save = function (user) {

        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: "api/user/save",
            data: $.param(user),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(response.data);

            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
            });

        return deferred.promise;
    }
    // delete User
    userService.delete = function (id) {
        var deferred = $q.defer();
        $http.post("api/user/delete/" + id)
            .then(function successCallback(response) {
                deferred.resolve();
            }, function errorCallback(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }
    // Get new Change Password object
    userService.newPasswordChange = function (userId) {
        var deferred = $q.defer();
        $http.get("api/user/changepassword/new/" + userId)
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(response.data);

            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
            });

        return deferred.promise;
    }
    // Save Password Change
    userService.savePasswordChange = function (passwordChange) {

        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: "api/user/changepassword/save",
            data: $.param(passwordChange),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(response.data);

            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
            });

        return deferred.promise;
    }
    //check existed username
    userService.checkExistedUsername = function (username, skipUserId) {
        var deferred = $q.defer();
        $http.get("api/user/checkexistedusername" + "?username=" + username + "&skipUserId=" + skipUserId)
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(response);

            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
            });

        return deferred.promise;
    }
    //save avatar
    userService.saveAvatar = function (userId, pictureId) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: "api/user/updateavatar",
            data: $.param({ userId: userId, pictureId: pictureId }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(response.data);

            }, function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
            });

        return deferred.promise;
    }
    //login
    userService.login = function (username, password) {
        var contentHeaders = [{ 'Content-Type': 'application/json' },
        { 'Accept': 'application/json' },
        { 'Content-Type': 'application/x-www-form-urlencoded' }
        ]
        var credentials = {
            UserName: username,
            Password: password
        };
        var resp = $http({
            url: "api/authenticate",
            method: "POST",
            data: credentials,
            headers: contentHeaders,
        });
        return resp;
    }
    //logout
    userService.logout = function () {
        // remove user from local storage and clear http auth header
        delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = "";
    }
    return userService;
});