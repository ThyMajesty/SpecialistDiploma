//connection-api.service.js
export class ConnectionApi {
    constructor($http, API) {
        this.$http = $http;
        this.API = API;
    }

    getConnections(query = '') {
        console.log(this.API);
        return this.$http.get(this.API.generateEntity + query + '/')
            .then((response) => {
                return response.data.result;
            });
    }

    getEntityByConnection(query = '') {
        return this.$http.get(this.API.generateEntity + query + '/')
            .then((response) => {
                return response.data ;
                //return response;
            });
    }
}
