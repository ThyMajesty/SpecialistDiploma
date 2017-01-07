export class EditBaseController {
    constructor(BaseApi, $timeout, $stateParams, addEditBaseModal) {
        dataInit = dataInit.bind(this);
        this.BaseApi = BaseApi;
        if (!$stateParams.base && !$stateParams.baseId) {
            addEditBaseModal().open().then(dataInit);
        } else{
            dataInit($stateParams.base, $stateParams.baseId)
        }

        function dataInit (base, baseId) {
            if (base) {
                this.base = angular.copy(base);
                if (!this.base.tree) {
                    this.base.tree = {
                        name: this.base.name,
                        description: this.base.description
                    }
                }
                return;
            }

            if (baseId) {
                this.BaseApi.getBase(this.baseId).then((response) => {
                    this.base = response.data || this.base;
                });
            }
        }
    }



    saveChanges() {
        this.editBaseForm.$setSubmitted();
        if (this.editBaseForm.$invalid) {
            return;
        }
        if (this.base.pk) {
            this.BaseApi.editBase(this.base.pk, this.base);
            return;
        }
        this.BaseApi.createBase(this.base);
    }
}
