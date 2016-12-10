export function AppConfig($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider) {

    $urlRouterProvider
        .otherwise('/');

    $stateProvider
        .state('app', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('app.auth', {
            url: '/auth',
            template: '<auth></auth>'
        })
        .state('app.index', {
            abstract: true,
            template: '<index></index>',
        })
        .state('app.index.home', {
            url: '/',
            template: '<home></home>',
        })
        .state('app.index.user', {
            url: '/user/:userId',
            template: '<user-page user-info="$resolve.userInfo"></user-page>',
            resolve: {
                userInfo: function() {
                    return {};
                }
            }
        });

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;

    $httpProvider.interceptors.push(function($q, $location, $localStorage) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                let token = $localStorage.token;
                if (token) {
                    config.headers.Authorization = token;
                }
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/auth');
                }
                return $q.reject(response);
            }
        };
    });

}
