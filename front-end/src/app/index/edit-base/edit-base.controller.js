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
                        name: this.base.value.name,
                        description: this.base.value.description
                    }
                }
                return;
            }

            if (baseId) {
                this.BaseApi.getBase(baseId).then((response) => {
                    this.base = response.data || this.base;
                });
            }
        }
    }

    filesChanged(files) {
        if(files && files.length > 0){
            this.base.value.files = files;
        }
    }

    saveChanges() {
        this.editBaseForm.$setSubmitted();
        if (this.editBaseForm.$invalid) {
            return;
        }
        if (this.base.id) {
            console.log(this.base.id)
            this.BaseApi.editBase(this.base.id, this.base);
            return;
        }
        this.BaseApi.createBase(this.base);
    }
}
