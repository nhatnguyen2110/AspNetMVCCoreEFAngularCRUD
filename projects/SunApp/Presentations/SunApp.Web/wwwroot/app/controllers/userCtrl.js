var app = angular.module('MyApp');
app.controller('userCtrl', function ($scope, $state, $stateParams, $log, $uibModal, Notification, User, ModalService) {

    $scope.searchText = '';
    $scope.users = searchUsers();
    $scope.userFillToModal = null;

    $scope.$watch('searchText', function (newVal, oldVal) {
        if (newVal != oldVal) {
            searchUsers();
        }
    }, true);
    // Search Users
    function searchUsers() {
        User.search($scope.searchText)
            .then(function () {
                $scope.users = User.users;
            });
    };
    // Add User
    $scope.addUser = function () {
        User.newUser()
            .then(function (data) {
                $scope.userFillToModal = User.userFillToModal;
                $scope.open('lg');
            });
    }
    // Delete an user and hide the row
    $scope.deleteUser = function ($event, id) {

        ModalService.Confirm('Do you want to delete this item?', 'Confirm?')
            .then(function (result) {
                if (result) {
                    User.delete(id)
                        .then(function () {
                            var element = $event.currentTarget;
                            $(element).closest('div[class^="col-lg-12"]').hide();
                            Notification.success('Delete item successfully');
                            $state.go('user');
                        })
                }

            });

    };
    // Open model to add user
    $scope.open = function (size) {
        var modalInstance = $uibModal.open({
            animation: false,
            backdrop: 'static',
            templateUrl: 'app/views/user/userAddEditModal.html',
            controller: 'userDetailModalCtrl',
            size: size,
            resolve: {
                user: function () {
                    return $scope.userFillToModal;
                }
            }
        });
        modalInstance.result.then(function (response) {
            $scope.currentUser = response;
            $state.go('dashboard.user.detail', { 'userId': response.id });
            searchUsers();
            Notification.success('Add user successfully');
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

});

app.controller('userDetailModalCtrl', function ($scope, $uibModalInstance, User, user) {
    $scope.user = user;
    $scope.headerText = "Add New User";
    if ($scope.user.id > 0) {
        $scope.headerText = "Edit User";
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function () {
        User.save($scope.user).then(function (response) {
            $uibModalInstance.close(response);
        })
    };
});
