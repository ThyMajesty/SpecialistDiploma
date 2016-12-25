export class DashboardController {
    constructor(BaseApi) {
        this.BaseApi = BaseApi;
        this.data = {};

        this.BaseApi.getBasesList().then((response) => {
            this.data = {
                bases: response.data
            }
            console.log(response)
        });
    }
}
