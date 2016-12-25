//base-api.service.js
export class BaseApi {
    constructor($http, API) {
        this.$http = $http;
        this.API = API;
    }

    getBasesList() {
        return this.$http.get(this.API.knowlagedb)
            .then((response) => {
                
                console.log(response);
                return response;
            });
    }

    createBase(newBase) {
        return this.$http.post(this.API.knowlagedb, newBase)
            .then((response) => {
                
                console.log(response);
                return response;
            });
    }

    getBase(pk) {
        return this.$http.get(this.API.knowlagedb + pk + '/')
            .then((response) => {
                
                console.log(response);
                return response;
            });
    }

    editBase(pk, editedBase) {
        return this.$http.put(this.API.knowlagedb + pk, editedBase)
            .then((response) => {
                
                console.log(response);
                return response;
            });
    }
}
