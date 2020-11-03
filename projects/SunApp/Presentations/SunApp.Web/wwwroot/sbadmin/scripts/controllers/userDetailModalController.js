var app = angular.module('sbAdminApp');
app.controller('userDetailModalCtrl', function ($scope, $uibModalInstance, UserService, user) {
    $scope.user = user;
    $scope.headerText = "Add New User";
    if ($scope.user.id > 0) {
        $scope.headerText = "Edit User";
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function () {
        UserService.save($scope.user).then(function (response) {
            $uibModalInstance.close(response);
        })
    };
});