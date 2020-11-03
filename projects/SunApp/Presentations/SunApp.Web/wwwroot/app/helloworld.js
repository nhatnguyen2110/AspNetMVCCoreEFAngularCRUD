var myApp = angular.module('helloworld', ['ui.router']);

myApp.config(function ($stateProvider) {
    var states = [
        {
            name: 'hello',
            url: '/hello',
            //template: '<h3>Hello World!</h3>'
            // Using component: instead of template:
            component: 'hello'
        },
        {
            name: 'about',
            url: '/about',
            template: '<h3>Its the UI-Router hello world app!</h3>'
        },
        {
            name: 'people',
            url: '/people',
            component: 'people',
            // This state defines a 'people' resolve
            // It delegates to the PeopleService to HTTP fetch (async)
            // The people component receives this via its `bindings: `
            resolve: {
                people: function (PeopleService) {
                    return PeopleService.getAllPeople();
                }
            }
        },
        {
            name: 'people.person',
            url: '/{personId}',
            component: 'person',
            resolve: {
                person: function (people, $stateParams) {
                    return people.find(function (person) {
                        return person.id === $stateParams.personId;
                    });
                }
            }
        }
    ]
    // Loop over the state definitions and register them
    states.forEach(function (state) {
        $stateProvider.state(state);
    });
});

myApp.run(function ($http, $uiRouter) {
    var Visualizer = window['ui-router-visualizer'].Visualizer;
    $uiRouter.plugin(Visualizer);
    $http.get('app/data/people.json', { cache: true });
});