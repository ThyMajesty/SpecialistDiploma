export function AppConfig($stateProvider, $urlRouterProvider, API, $localStorageProvider, $httpProvider, $resourceProvider) {
    //console.log(API, $localStorageProvider, $resourceProvider);

    $urlRouterProvider
        .otherwise('/home');

    $stateProvider
        .state('app', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('app.auth', {
            url: '/auth',
            template: '<auth></auth>'
        })
        .state('app.home', {
            url: '/home',
            template: '<home user-info="$resolve.userInfo"></home>',
            resolve: {
                userInfo: function(UserInfoService) {
                    return UserInfoService.getUserInfo();
                }
            }
        });


    $httpProvider.interceptors.push(function($q, $location, $localStorage) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = $localStorage.token;
                    //config.headers['Access-Control-Allow-Origin'] = '*';
                    //config.headers['Content-Type'] = 'application/json';
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
