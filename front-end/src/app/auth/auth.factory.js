export function AuthApi($http, API) {
    return {
        login
    }

    function login(userData) {
        if (!(userData && angular.isObject(userData))) {
            return;
        }
        //userData = JSON.stringify(userData);
        return $http({
            method: 'POST',
            url: API + 'api/token-auth/',
            data: JSON.stringify(userData)
        }).then((response) => {
            console.log(response);
            return response;
        });
    }
}
