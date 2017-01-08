export function AppConfig($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider, $sceProvider) {

    $sceProvider.enabled(false);

    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('app', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('app.auth', {
            url: '/auth',
            component: 'auth'
        })
        .state('app.index', {
            abstract: true,
            component: 'index',
        })
        .state('app.index.dashboard', {
            url: '/',
            component: 'dashboard',
        })
        .state('app.index.edit', {
            params: { base: null },
            url: '/edit/:baseId',
            component: 'editBase',
        })
        .state('app.index.create', {
            reload:false,
            params: { base: null, baseId:null },
            url: '/create',
            component: 'editBase',
        })
        .state('app.index.user', {
            url: '/user/:userId',
            component: 'userPage',
        });

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;

    $httpProvider.interceptors.push(function($q, $location, $localStorage) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                let token = $localStorage.token;
                if (token) {
                    config.headers.Authorization = 'jwt ' + token;
                }
                return config;
            },

            'requestError': function(rejection) {
                return $q.reject(rejection);
            },

            'response': function(response) {
                return response;
            },

            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/auth');
                }
                return response || $q.when(response);
            },
        };
    });

}
