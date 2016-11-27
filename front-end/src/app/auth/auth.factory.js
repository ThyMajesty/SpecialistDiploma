export function AuthApi($http, AUTH, API, $localStorage) {
    return {
        login,
        signin,
        postDb
    }

    function login(userData) {
        if (!(userData && angular.isObject(userData))) {
            return;
        }
        const { username, password } = userData;

        return $http({
            method: 'POST',
            url: AUTH,
            data: angular.toJson({ username, password })
        }).then((response) => {
            $localStorage.token = response.data.token;
            if (userData.rememberMe) {
                $localStorage.username = userData.username;
                $localStorage.password = userData.password;
            }
            return response;
        });
    }

    function signin(userData) {
        if (!(userData && angular.isObject(userData))) {
            return;
        }
        const { username, email, password, confirmPassword } = userData;

        return $http({
            method: 'POST',
            url: AUTH,
            data: angular.toJson({ username, email, password, confirmPassword })
        }).then((response) => {
            $localStorage.token = response.data.token;
            return response;
        });
    }

    function postDb(data) {
        return $http({
            method: 'POST',
            url: API + '/db/',
            data: JSON.stringify(data)
        }).then((response) => {
            console.log(response);
            return response;
        });
    }
}
