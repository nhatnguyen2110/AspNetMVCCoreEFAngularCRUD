var app = angular.module('MyApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    //'ui-notification',
    'ngSanitize',
    //'ngMessages',
    //'ngAnimate',
    //'angularFileUpload'
]);

app.config(['$urlRouterProvider', '$stateProvider', '$ocLazyLoadProvider', function ($urlRouterProvider, $stateProvider, $ocLazyLoadProvider) {
    angular.lowercase = angular.$$lowercase;  //fix issue lowercase can't find in angularjs 1.7+
    // default route
    $urlRouterProvider.otherwise('/dashboard/home');
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
    });
 
    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/views/main.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        {
                            name: 'MyApp',
                            files: [
                                'app/directives/header/header.js',
                                'app/directives/common.js',
                                'app/services/ModalService.js'
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
            template: '<h3>Welcome to My Application!</h3><p>This is the Home page</p>'
        })
        .state('dashboard.user', {
            url: '/user',
            templateUrl: 'app/views/user/user.html',
            controller: 'userCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MyApp',
                        files: [
                            'app/controllers/userCtrl.js',
                            'app/services/User.js',
                            'app/directives/asUser.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.user.detail', {
            url: '/detail/{userId:[0-9]{1,9999999}}',
            templateUrl: 'app/views/user/userDetail.html',
            controller: 'userDetailCtrl',
            //component: 'userDetailComp',
            //resolve: {
            //    currentUser: function (User, $stateParams) {
            //        return User.userDetail($stateParams.userId);
            //    }
            //}
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MyApp',
                        files: [
                            'app/controllers/userDetailCtrl.js',
                            'app/directives/userDir.js',
                            'app/directives/fineUploader.js',
                            '//cdnjs.cloudflare.com/ajax/libs/file-uploader/5.5.0/fine-uploader-gallery.min.css',
                            '//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.2/dialog-polyfill.min.css',
                            '//cdnjs.cloudflare.com/ajax/libs/file-uploader/5.5.0/fine-uploader.min.js',
                            '//cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.4.2/dialog-polyfill.min.js'
                        ]
                    })

                }
            }

        })
        .state('dashboard.aboutus', {
            url: '/about-us',
            templateUrl: 'app/views/aboutus/aboutus.html'
        })
}]);