//user-api.service.js
export class UserApi {
    constructor($http, API, $localStorage, $state) {
        this.$http = $http;
        this.API = API;
        this.$storage = $localStorage;
        this.$state = $state;
    }

    getUser(userId) {
        return this.$http.get(this.API.USER + userId)
            .then((response) => {
                console.log(response);
                return response;
            });
    }
}
