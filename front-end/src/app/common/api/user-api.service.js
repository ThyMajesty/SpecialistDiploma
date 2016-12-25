//user-api.service.js
export class UserApi {
    constructor($http, API, $localStorage, $state) {
        this.$http = $http;
        this.API = API;
        this.$storage = $localStorage;
        this.$state = $state;
    }

    getUser(userId = '9d3f1dc8-9107-4c31-9c55-863756768740') {
        return this.$http.get(this.API.USER /*+ userId + '/?format=json'*/)
            .then((response) => {
                //console.log(response);
                return response.data;
            });
    }

    setUser(userId = '9d3f1dc8-9107-4c31-9c55-863756768740', data) {
        return this.$http.post(this.API.USER /*+ userId *//*+ '/?format=json'*/, data)
            .then((response) => {
                //console.log(response);
                return response.data;
            });
    }
}
