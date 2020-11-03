var app = angular.module('sbAdminApp');
app.controller('userDetailCtrl', function ($scope, $state, $stateParams, $rootScope, $log, $uibModal, UserService, Notification) {
    $scope.currentUser = null;
    // Load User
    $scope.loadUser = function (userId) {
        UserService.userDetail(userId).then(function (data) {
            $scope.currentUser = data;
        });
    }
    // Back to User List
    $scope.backToUsers = function () {
        $scope.$emit('reload-users', 'reload user grid');//call parent controller to reload user grid
        $state.go('dashboard.users');
    }
    $scope.loadUser($stateParams.userId);
    // Edit User
    $scope.editUser = function () {
        $scope.openEditUserModal('lg');
    }
    // Edit Avatar
    $scope.uploadAvatar = function () {
        $scope.openUploadAvatarModal('sm');
    }
    // Open model to edit user
    $scope.openEditUserModal = function (size) {
        var modalInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'sbadmin/views/users/userAddEditModal.html',
            controller: 'userDetailModalCtrl',
            size: size,
            resolve: {
                user: function () {
                    return $scope.currentUser;
                }
            }
        });
        modalInstance.result.then(function (response) {
            $scope.currentUser = response;
            $state.go('dashboard.users.detail', { 'userId': response.id });
            Notification.success("Save changes successfully");
        }, function () {
            $scope.loadUser($stateParams.userId);
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    // Change Password
    $scope.changePassword = function (userId) {
        UserService.newPasswordChange(userId)
            .then(function (data) {
                $scope.openChangePasswordModal('lg', data);
            });

    }
    // Open modal to change password
    $scope.openChangePasswordModal = function (size, passwordChangeObj ) {
        var modalInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'sbadmin/views/users/userChangePasswordModal.html',
            controller: 'userChangePasswordModalCtrl',
            size: size,
            resolve: {
                passwordChange: function () {
                    return passwordChangeObj;
                }
            }
        });
        modalInstance.result.then(function (response) {
            //todo

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    

    // Open model to upload avatar
    $scope.openUploadAvatarModal = function (size) {
        var modalInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'sbadmin/views/users/userUploadAvatarModal.html',
            controller: 'userUploadAvatarModalCtrl',
            size: size,
            resolve: {
                currentUser: function () {
                    return $scope.currentUser;
                }
            }
        });
        modalInstance.result.then(function (response) {
            //todo
            $scope.loadUser($stateParams.userId);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

app.controller('userChangePasswordModalCtrl', function ($scope, $uibModalInstance, passwordChange, UserService, Notification) {
    $scope.passwordChange = passwordChange;
    $scope.retypePassword = "";
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function () {
        UserService.savePasswordChange($scope.passwordChange).then(function (response) {
            //notify
            if (response.isSuccess) {
                $uibModalInstance.close(response);
                Notification.success(response.message);
            }
            else {
                Notification.error(response.message);
            }
        })
    };
});
app.controller('userUploadAvatarModalCtrl', function ($scope, $uibModalInstance, UserService, Notification, currentUser) {
    $scope.pictureId = 0;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function () {
        if ($scope.pictureId > 0) {
            UserService.saveAvatar(currentUser.id, $scope.pictureId).then(function (response) {
                //notify
                if (response.isSuccess) {
                    $uibModalInstance.close(response);
                    Notification.success(response.message);
                }
                else {
                    Notification.error(response.message);
                }
            })
        }
    };

});