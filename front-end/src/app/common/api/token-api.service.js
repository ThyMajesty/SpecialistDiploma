//token-api.service.js
export class TokenApi {
    constructor($http, API, $localStorage, $state, $q) {
        this.$http = $http;
        this.API = API;
        this.$storage = $localStorage;
        this.$state = $state;
        this.$q = $q;
    }

    tokenRefresh(input = { token: this.$storage.token }) {
        return this.$http.post(this.API.tokenRefresh, input)
            .then((response) => {
                if (response.status !== 200) {
                    this.$state.go('app.auth.login');
                    return this.$q.reject(response);
                }
                this.$storage.token = response.data.token;
                return response;
            });
    }

    tokenVerify(input = { token: this.$storage.token }) {
        return this.$http.post(this.API.tokenVerify, input)
            .then((response) => {
                if (response.status !== 200) {
                    this.$state.go('app.auth.login');
                    return this.$q.reject(response);
                }
                this.$storage.token = response.data.token;
                return response;
            });
    }
}
