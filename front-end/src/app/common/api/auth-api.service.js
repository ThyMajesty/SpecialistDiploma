//auth-api.service.js
export class AuthApi {
    constructor($http, API, $localStorage, $state, $q) {
        this.$http = $http;
        this.API = API;
        this.$storage = $localStorage;
        this.$state = $state;
        this.$q = $q;
    }

    login(input) {
        const { username, password } = input;
        return this.$http.post(this.API.AUTH, { username, password })
            .then((response) => {
                if (response.status == 400) {
                    return this.$q.reject(response);
                }
                this.$storage.token = response.data.token;
                
                if (input.rememberMe) {
                    this.$storage.user = { username, password };
                }
                this.$state.go('app.index.dashboard');
                return response;
            });
    }

    signin(input) {
        const { username, email, password, confirmPassword } = input;
        return this.$http.post(this.API.AUTH, { username, email, password, confirmPassword })
            .then((response) => {
                this.$storage.token = response.data.token;
                return response;
            });
    }
}
