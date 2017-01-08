export class AddEditBaseController {
    constructor(config, base, $uibModalInstance, BaseApi) {
        this.$uibModalInstance = $uibModalInstance;
        this.config = config;
        this.base = base || {};
        this.BaseApi = BaseApi;
    }

    add() {
        this.baseForm.$setSubmitted();
        if (this.baseForm.$invalid) {
            return;
        }
        if (!this.base.tree) {
            this.base.tree = {
                value: angular.copy(this.base.value)
            }
        }
        this.BaseApi.createBase(this.base).then((response) => {
            this.$uibModalInstance.close(response);
        })
        
    }

    confirm() {
        this.$uibModalInstance.close('confirm');
    }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }


}
