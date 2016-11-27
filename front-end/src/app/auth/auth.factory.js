export function AuthApi($http, API) {
    return {
        login
    }

    function login(userData) {
        if (!(userData && angular.isObject(userData))) {
            return;
        }
        userData = JSON.stringify(userData);
        return $http.post(API + 'login', userData, {}).then((response) => {
            console.log(response);
            return response;
        });
    }
}
