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
        .state('app.index.dashboard', {
            url: '/',
            template: '<dashboard></dashboard>',
        })
        .state('app.index.edit', {
            url: '/edit/:baseId',
            template: '<edit-base base="$resolve.base"></edit-base>',
            resolve: {
                base: function($stateParams, BaseApi) {
                    return BaseApi.getBase($stateParams.baseId).then((response) => {return response.data})
                }
            }
        })
        .state('app.index.create', {
            url: '/create',
            template: '<edit-base base="$resolve.base"></edit-base>',
            resolve: {
                base: function($stateParams) {
                    return {};
                }
            }
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
                    config.headers.Authorization = 'jwt ' + token;
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
