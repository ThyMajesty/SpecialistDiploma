//instance-api.service.js
export class InstanceApi {
    constructor($http, API) {
        this.$http = $http;
        this.API = API;
    }

    addInstance(basePk, entity) {
        return this.$http.post(this.API.instance /*+ '?mindmap=' + basePk*/, entity).then((response) => {
            console.log(response.data);
            return response.data;
        });
    }

    editInstance(basePk, entity) {
        return this.$http.put(this.API.instance + entity.id + '/' + '?mindmap=' + basePk, 
            JSON.stringify(entity, (key, value) => {
                if (['x', 'y', 'parent', 'x0', 'y0', 'depth'].indexOf(key) > -1) {
                    return undefined;
                }
                return value;
            })).then((response) => {
            console.log(response.data);
            return response.data;
        });
    }

    deleteInstance(basePk, entity) {
        console.log(basePk, entity)
        return this.$http.delete(this.API.instance + entity.id + '/' + '?mindmap=' + basePk).then((response) => {
            console.log(response.data);
            return response.data;
        });
    }

}

