var app = angular.module('app');
app.controller('UserCtrl', function ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, UserService) {
    $scope.dtInstance = {};
    $scope.userFillToModal = {};

    $scope.dtColumns = [
        //here We will add .withOption('name','column_name') for send column name to the server 
        DTColumnBuilder.newColumn(null).withTitle("Avatar").notSortable().renderWith(avatarHtml),
        DTColumnBuilder.newColumn("userName", "User Name").withOption('name', 'userName'),
        DTColumnBuilder.newColumn("fullName", "Full Name").withOption('name', 'fullName'),
        DTColumnBuilder.newColumn("email", "Email").withOption('name', 'email'),
        DTColumnBuilder.newColumn("active", "Active").withOption('name', 'active').renderWith(activeHtml),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
    ]
    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        dataSrc: "data",
        url: "/api/user/getdata",
        type: "POST"
    })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting', [1, 'asc']) // for default sorting column // here 0 means first column
        .withOption('createdRow', createdRow);

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        if (data.isSystemAccount) {
            return '<button class="btn btn-info" ng-click="viewDetailUser(' + data.id + ')" title="View Detail">' +
                '   <i class="fa fa-eye"></i>' +
                '</button>';
        }
        return '<button class="btn btn-info" ng-click="viewDetailUser(' + data.id + ')" title="View Detail">' +
            '   <i class="fa fa-eye"></i>' +
            '</button>&nbsp;' +
            '<button class="btn btn-danger" ng-click="deleteUser(' + data.id + ' )" title="Delete">' +
            '   <i class="fa fa-trash-o"></i>' +
            '</button>';
    }
    function avatarHtml(data, type, full, meta) {
        return '<img alt="' + data.fullName + '" src="' + data.imageUrl + '" />';
    }
    function activeHtml(data, type, full, meta) {
        if (data)
            return '<span class="lead text-success"><i class="fa fa-check" /></span>';
        else
            return '<span class="lead text-danger"><i class="fa fa-times" /></span>';
    }
    $scope.viewDetailUser = function (id) {
        $state.go('dashboard.users.detail', { 'userId': id });
    }
    //$scope.deleteUser = function (id) {
    //    ModalService.Confirm('Do you want to delete this item?', 'Confirm?')
    //        .then(function (result) {
    //            if (result) {
    //                UserService.delete(id)
    //                    .then(function () {
    //                        $scope.reloadUsers();
    //                        Notification.success('Delete user successfully');
    //                    })
    //            }

    //        });


    //}
    //// Add User
    //$scope.addUser = function () {
    //    UserService.newUser()
    //        .then(function (data) {
    //            $scope.userFillToModal = data;
    //            $scope.open('lg');
    //        });
    //}
    // Reload User
    $scope.reloadUsers = function () {
        var resetPaging = false;
        $scope.dtInstance.reloadData(null, resetPaging);
    }
    //// Open model to add user
    //$scope.open = function (size) {
    //    var modalInstance = $uibModal.open({
    //        animation: false,
    //        backdrop: 'static',
    //        templateUrl: 'sbadmin/views/users/userAddEditModal.html',
    //        controller: 'userDetailModalCtrl',
    //        size: size,
    //        resolve: {
    //            user: function () {
    //                return $scope.userFillToModal;
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (response) {
    //        //$scope.currentUser = response;
    //        //$state.go('dashboard.user.detail', { 'userId': response.id });
    //        $scope.reloadUsers();
    //        Notification.success('Add user successfully');
    //    }, function () {
    //        $log.info('Modal dismissed at: ' + new Date());
    //    });
    //};
});
