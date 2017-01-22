//user-api.service.js
export class UserApi {
    constructor($http, API, $localStorage, $state) {
        this.$http = $http;
        this.API = API;
        this.$storage = $localStorage;
        this.$state = $state;
    }

    getUser(userId) {
        return this.$http.get(this.API.USER)
            .then((response) => {
                //console.log(response);
                this.$storage.user = response.data;
                return response.data;
            });
    }

    setUser(data) {
        return this.$http.post(this.API.USER, data)
            .then((response) => {
                //console.log(response);
                return response.data;
            });
    }
}
