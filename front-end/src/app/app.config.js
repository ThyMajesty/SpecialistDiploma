export function AppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .otherwise('/home');

    $stateProvider
        .state('app', {
            abstract: true,
            template: '<ui-view/>',
            resolve: {
                lol: function() {
                    console.log('app: lol');
                    return 'lol';
                }
            }
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
}
