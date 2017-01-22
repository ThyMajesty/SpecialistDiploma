export function AuthConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/auth', '/auth/login');

    $stateProvider
        .state('app.auth.login', {
            url: '/login',
            template: '<login></login>'
        })
        .state('app.auth.signin', {
            url: '/signin',
            template: '<signin></signin>'
        });
}
