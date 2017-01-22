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
                    this.$storage.username = username;
                    this.$storage.password = password;
                }
                this.$state.go('app.index.dashboard');
                return response;
            });
    }

    signup(input) {
        const { username, email, password, confirmPassword } = input;
        return this.$http.post(this.API.SIGNUP, { username, email, password, confirmPassword })
            .then((response) => {
                if (response.data.msg && response.data.msg.match(/.*UNIQUE constraint failed.*/g)) {
                    return this.$q.reject(response);
                }
                this.$storage.token = response.data.token;
                this.$state.go('app.index.dashboard');
                return response;
            });
    }

    getSocialUrls() {
        return this.$http.get(this.API.SIGNUP)
            .then((response) => {
                return response;
            });
    }
}
