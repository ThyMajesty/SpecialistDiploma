//auth-api.service.js
export class AuthApi {
    constructor($http, API, $localStorage, $state) {
        this.$http = $http;
        this.API = API;
        this.$storage = $localStorage;
        this.$state = $state;
    }

    login(input) {
        const { username, password } = input;
        return this.$http.post(this.API.AUTH, { username, password })
            .then((response) => {
                this.$storage.token = response.data.token;
                
                if (input.rememberMe) {
                    this.$storage.user = { username, password };
                }
                //console.log(this.$state.go('app.home'));
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
