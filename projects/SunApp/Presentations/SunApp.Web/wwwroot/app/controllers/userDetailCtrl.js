var app = angular.module("MyApp")
app.controller('userDetailCtrl', function ($scope, $state, $stateParams, $log, $uibModal, User, Notification) {
    $scope.currentUser = null;
    // Load User
    $scope.loadUser = function (userId) {
        User.userDetail(userId).then(function () {
            $scope.currentUser = User.currentUser;
        });
    }
    
    $scope.loadUser($stateParams.userId);
   
    // Edit User
    $scope.editUser = function () {
        $scope.openEditUserModal('lg');
    }
    // Edit User
    $scope.uploadAvatar = function () {
        $scope.openUploadAvatarModal('sm');
    }
    // Open model to edit user
    $scope.openEditUserModal = function (size) {
        var modalInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'app/views/user/userAddEditModal.html',
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
            $state.go('user.detail', { 'userId': response.id });
            Notification.success("Save changes successfully");
        }, function () {
            $scope.loadUser($stateParams.userId);
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    // Change Password
    $scope.changePassword = function (userId) {
        User.newPasswordChange(userId)
            .then(function (data) {
                $scope.openChangePasswordModal('lg');
            });
        
    }
    // Open modal to change password
    $scope.openChangePasswordModal = function (size) {
        var modalInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'app/views/user/userChangePasswordModal.html',
            controller: 'userChangePasswordModalCtrl',
            size: size,
            resolve: {
                passwordChange: function () {
                    return User.passwordChangeObj;
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
            templateUrl: 'app/views/user/userUploadAvatarModal.html',
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

app.controller('userChangePasswordModalCtrl', function ($scope, $uibModalInstance, passwordChange, User, Notification) {
    $scope.passwordChange = passwordChange;
    $scope.retypePassword = "";
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function () {
        User.savePasswordChange($scope.passwordChange).then(function (response) {
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
app.controller('userUploadAvatarModalCtrl', function ($scope, $uibModalInstance, User, Notification, currentUser) {
    $scope.pictureId = 0;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function () {
        if ($scope.pictureId >0) {
            User.saveAvatar(currentUser.id, $scope.pictureId).then(function (response) {
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