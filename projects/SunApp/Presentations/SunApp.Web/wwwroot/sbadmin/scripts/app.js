'use strict';
angular
    .module('sbAdminApp', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'ngSanitize',
        'ngStorage',
        'angular-loading-bar',
    ])
    .run(function ($state, $rootScope, $http, $location, $localStorage) {
        $rootScope.$state = $state;
        // Keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = "Bearer " + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            var publicPages = ["/login"];
            var restrictPage = publicPages.indexOf($location.path()) === -1;
            if (restrictPage && !$localStorage.currentUser) {
                $location.path("login");
            }
        });
    })
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        angular.lowercase = angular.$$lowercase;  //fix issue lowercase can't find in angularjs 1.7+
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
        });

        $urlRouterProvider.otherwise('/dashboard/home');

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'sbadmin/views/dashboard/main.html',
                resolve: {
                    loadMyDirectives: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'sbAdminApp',
                                files: [
                                    'sbadmin/scripts/directives/header/header.js',
                                    'sbadmin/scripts/directives/header/header-notification/header-notification.js',
                                    'sbadmin/scripts/directives/sidebar/sidebar.js',
                                    'sbadmin/scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                                    'sbadmin/scripts/services/ModalService.js',
                                    'sbadmin/scripts/services/UserService.js',
                                    'sbadmin/scripts/directives/common.js'
                                ]
                            }),
                            $ocLazyLoad.load(
                                {
                                    name: 'toggle-switch',
                                    files: ["sbadmin/js/angular-toggle-switch/angular-toggle-switch.min.js",
                                        "sbadmin/js/angular-toggle-switch/angular-toggle-switch.css"
                                    ]
                                }),

                            $ocLazyLoad.load(
                                {
                                    name: 'ngMessages',
                                    files: ['//cdnjs.cloudflare.com/ajax/libs/angular-messages/1.7.0-rc.0/angular-messages.min.js']
                                }),
                            $ocLazyLoad.load(
                                {
                                    name: 'ui-notification',
                                    files: [
                                        '//cdnjs.cloudflare.com/ajax/libs/angular-ui-notification/0.3.6/angular-ui-notification.min.css',
                                        '//cdnjs.cloudflare.com/ajax/libs/angular-ui-notification/0.3.6/angular-ui-notification.min.js'
                                    ]
                                })
                    }
                }
            })
            .state('dashboard.home', {
                url: '/home',
                controller: 'MainCtrl',
                templateUrl: 'sbadmin/views/dashboard/home.html',
                resolve: {
                    loadMyFiles: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: [
                                'sbadmin/scripts/controllers/main.js',
                                'sbadmin/scripts/directives/timeline/timeline.js',
                                'sbadmin/scripts/directives/notifications/notifications.js',
                                'sbadmin/scripts/directives/chat/chat.js',
                                'sbadmin/scripts/directives/dashboard/stats/stats.js'
                            ]
                        })
                    }
                }
            })
            .state('dashboard.form', {
                templateUrl: 'sbadmin/views/form.html',
                url: '/form'
            })
            .state('dashboard.blank', {
                templateUrl: 'sbadmin/views/pages/blank.html',
                url: '/blank'
            })
            .state('login', {
                templateUrl: 'sbadmin/views/pages/login.html',
                url: '/login',
                controller: 'loginCtrl',
                resolve: {
                    loadMyFiles: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'ngMessages',
                                files: ['//cdnjs.cloudflare.com/ajax/libs/angular-messages/1.7.0-rc.0/angular-messages.min.js']
                            }),
                            $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'sbadmin/scripts/services/UserService.js',
                                    'sbadmin/scripts/controllers/loginController.js',
                                ]
                            })
                    }
                }
            })
            .state('dashboard.chart', {
                templateUrl: 'sbadmin/views/chart.html',
                url: '/chart',
                controller: 'ChartCtrl',
                resolve: {
                    loadMyFile: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'chart.js',
                            files: [
                                'sbadmin/js/angular-chart/angular-chart.min.js',
                                'sbadmin/js/angular-chart/angular-chart.css'
                            ]
                        }),
                            $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: ['sbadmin/scripts/controllers/chartContoller.js']
                            })
                    }
                }
            })
            .state('dashboard.table', {
                templateUrl: 'sbadmin/views/table.html',
                url: '/table'
            })
            .state('dashboard.panels-wells', {
                templateUrl: 'sbadmin/views/ui-elements/panels-wells.html',
                url: '/panels-wells'
            })
            .state('dashboard.buttons', {
                templateUrl: 'sbadmin/views/ui-elements/buttons.html',
                url: '/buttons'
            })
            .state('dashboard.notifications', {
                templateUrl: 'sbadmin/views/ui-elements/notifications.html',
                url: '/notifications'
            })
            .state('dashboard.typography', {
                templateUrl: 'sbadmin/views/ui-elements/typography.html',
                url: '/typography'
            })
            .state('dashboard.icons', {
                templateUrl: 'sbadmin/views/ui-elements/icons.html',
                url: '/icons'
            })
            .state('dashboard.grid', {
                templateUrl: 'sbadmin/views/ui-elements/grid.html',
                url: '/grid'
            })
            .state('dashboard.users', {
                templateUrl: 'sbadmin/views/users/users.html',
                url: '/users',
                controller: 'UserCtrl',
                resolve: {
                    loadMyFile: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'datatables',
                                files: [
                                    '//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/js/jquery.dataTables.min.js',
                                    'sbadmin/js/angular-datatables/angular-datatables.js',
                                    'sbadmin/js/angular-datatables/css/angular-datatables.css'
                                ]
                            }),
                            $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'sbadmin/scripts/directives/user/userDir.js',
                                    'sbadmin/scripts/controllers/userController.js',
                                    'sbadmin/scripts/controllers/userDetailModalController.js'
                                ]
                            })

                    }
                }
            })
            .state('dashboard.users.detail', {
                templateUrl: 'sbadmin/views/users/userDetail.html',
                url: '/detail/{userId:[0-9]{1,9999999}}',
                controller: 'userDetailCtrl',
                resolve: {
                    loadMyFile: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: [
                                'sbadmin/scripts/controllers/userDetailController.js',
                                'sbadmin/scripts/directives/uploader/fineUploader.js',
                                '//cdnjs.cloudflare.com/ajax/libs/file-uploader/5.5.0/fine-uploader-gallery.min.css',
                                '//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.2/dialog-polyfill.min.css',
                                '//cdnjs.cloudflare.com/ajax/libs/file-uploader/5.5.0/fine-uploader.min.js',
                                '//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.2/dialog-polyfill.min.js'
                            ]
                        })

                    }
                }
            })
    }]);


