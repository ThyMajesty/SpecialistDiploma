export function AuthApi($http, AUTH, API, $localStorage) {
    return {
        login,
        postDb
    }

    function login(userData) {
        if (!(userData && angular.isObject(userData))) {
            return;
        }
        //userData = JSON.stringify(userData);
        return $http({
            method: 'POST',
            url: AUTH,
            data: JSON.stringify(userData)
        }).then((response) => {
            $localStorage.token = response.data.token;
            return response;
        });
    }

    function postDb(data) {
        return $http({
            method: 'POST',
            url: API +'/db/',
            data: JSON.stringify(data)
        }).then((response) => {
            console.log(response);
            return response;
        });
    }
}
