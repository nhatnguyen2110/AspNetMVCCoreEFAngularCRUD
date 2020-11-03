angular
    .module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

        $urlRouterProvider.otherwise('/dashboard');

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: true
        });

        $breadcrumbProvider.setOptions({
            prefixStateName: 'app.main',
            includeAbstract: true,
            template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
        });

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'coreui/views/common/layouts/full.html',
                //page title goes here
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                },
                resolve: {
                    loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Flags',
                            files: ['//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/css/flag-icon.min.css']
                        }, {
                            serie: true,
                            name: 'Font Awesome',
                            files: ['//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['//cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css']
                        }]);
                    }],
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'chart.js',
                            files: [
                                '//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js',
                                '//cdnjs.cloudflare.com/ajax/libs/angular-chart.js/1.1.1/angular-chart.min.js'
                            ]
                        }]);
                    }],
                }
            })
            .state('app.main', {
                url: '/dashboard',
                templateUrl: 'coreui/views/main.html',
                //page title goes here
                ncyBreadcrumb: {
                    label: 'Home',
                },
                //page subtitle goes here
                params: { subtitle: 'Welcome to ROOT powerfull Bootstrap & AngularJS UI Kit' },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                name: 'chart.js',
                                files: [
                                    '//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js',
                                    '//cdnjs.cloudflare.com/ajax/libs/angular-chart.js/1.1.1/angular-chart.min.js'
                                ]
                            },
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['coreui/js/controllers/main.js']
                        });
                    }]
                }
            })
            .state('appSimple', {
                abstract: true,
                templateUrl: 'coreui/views/common/layouts/simple.html',
                resolve: {
                    loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load CSS files
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'Font Awesome',
                            files: ['//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css']
                        }, {
                            serie: true,
                            name: 'Simple Line Icons',
                            files: ['//cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css']
                        }]);
                    }],
                }
            })

            // Additional Pages
            .state('appSimple.login', {
                url: '/login',
                templateUrl: 'coreui/views/pages/login.html'
            })
            .state('appSimple.register', {
                url: '/register',
                templateUrl: 'coreui/views/pages/register.html'
            })
            .state('appSimple.404', {
                url: '/404',
                templateUrl: 'coreui/views/pages/404.html'
            })
            .state('appSimple.500', {
                url: '/500',
                templateUrl: 'coreui/views/pages/500.html'
            })
            .state('app.users', {
                url: '/users',
                ncyBreadcrumb: {
                    label: 'Users'
                },
                templateUrl: 'coreui/views/users/userList.html',
                controller: 'UserCtrl',
                resolve: {
                    loadMyFile: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'datatables',
                                files: [
                                    'sbadmin/js/angular-datatables/angular-datatables.js',
                                    'sbadmin/js/angular-datatables/css/angular-datatables.css',
                                    '//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/js/jquery.dataTables.min.js',
                                ]
                            }),
                            $ocLazyLoad.load({
                                name: 'app',
                                files: [
                                    'coreui/js/services/UserService.js',
                                    'coreui/js/controllers/userController.js',
                                    
                                ]
                            })

                    }
                }
            })
    }]);
