export class DashboardController {
    constructor(BaseApi, addEditBaseModal, $state, $timeout) {

        this.BaseApi = BaseApi;
        this.data = {};
        this.$timeout = $timeout;

        this.newBase = null;
        this.addEditBaseModal = addEditBaseModal;
        this.$state = $state;

        this.BaseApi.getBasesList().then((response) => {
            this.data = {
                bases: response.data
            };
        });
    }

    addBase() {
        this.addEditBaseModal().open().then((response) => {
            this.$state.transitionTo('app.index.create', {base: response, baseId:null});  
        });
    }
}
