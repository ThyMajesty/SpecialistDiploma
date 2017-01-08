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

    deleteBase(pk) {
        return this.$http.delete(this.API.knowlagedb + pk + '/').then((response) => {
            return response;
        });
    }

    createBase(newBase) {
        return this.$http.post(this.API.knowlagedb, newBase)
            .then((response) => {
                return response.data;
            });
    }





    editBase(pk, editedBase) {
        return this.$http.put(this.API.testdb + pk + '/', 
            JSON.stringify(editedBase, (key, value) => {
                if (['x', 'y', 'parent', 'x0', 'y0', 'depth'].indexOf(key) > -1) {
                    return undefined;
                }
                return value;
            }))
            .then((response) => {
                return response.data;
            });
    }

    getBase(pk) {
        return this.$http.get(this.API.testdb + pk + '/' + '?mindmap=' + pk);
    }

}

