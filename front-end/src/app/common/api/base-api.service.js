//base-api.service.js
export class BaseApi {
    constructor($http, API) {
        this.$http = $http;
        this.API = API;
    }

    getBasesList() {
        return this.$http.get(this.API.knowlagedb)
            .then((response) => {
                
                return response;
            });
    }

    createBase(newBase) {
        return this.$http.post(this.API.knowlagedb, newBase)
            .then((response) => {
                return response.data;
            });
    }

    getBase(pk) {
        return this.$http.get(this.API.knowlagedb + pk + '/');
    }

    editBase(pk, editedBase) {
        return this.$http.put(this.API.knowlagedb + pk, editedBase)
            .then((response) => {
                return response.data;
            });
    }
}
