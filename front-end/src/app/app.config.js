export function AppConfig($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider, $sceProvider, $locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    console.log($locationProvider)

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
        .state('app.social', {
            params: { token: null },
            url: '/social?token',
            template: '<div></div>',
            controller: ($stateParams, $state, TokenApi) => {
                TokenApi.tokenVerify({ token: $stateParams.token }).then((response) => {
                    $state.go('app.index.dashboard');
                });
            }
        })
        .state('app.index', {
            abstract: true,
            component: 'index',
            resolve: {
                userData: (UserApi) => {
                    return UserApi.getUser();
                }
            }
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
            reload: false,
            params: { base: null, baseId: null },
            url: '/create',
            component: 'editBase',
        })
        .state('app.index.memorise', {
            params: { base: null },
            url: '/memorize/:baseId',
            component: 'memorise',
        })
        .state('app.index.user', {
            url: '/user/',
            component: 'userPage',
        });

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;

    $httpProvider.interceptors.push(function($q, $location, $localStorage, $state) {
        const statuses = {
            auth: [401, 403]
        }
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                let token = $localStorage.token;
                if (token) {
                    config.headers.Authorization = 'jwt ' + token;
                } else {
                    $state.go('app.auth');
                }
                return config;
            },

            'requestError': function(rejection) {
                return $q.reject(rejection);
            },

            'response': function(response) {
                console.log(response)
                if (statuses.auth.indexOf(response.status) > -1) {
                    $state.go('app.auth');
                    return $q.reject(response);
                }
                return response;
            },

            'responseError': function(response) {
                if (statuses.auth.indexOf(response.status) > -1) {
                    $state.go('app.auth');
                    return $q.reject(response);
                }
                return response || $q.when(response);
            },
        };
    });

}
