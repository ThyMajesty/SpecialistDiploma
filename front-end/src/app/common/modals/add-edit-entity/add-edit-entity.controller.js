export class AddEditEntityController {
    constructor(config, entity, $uibModalInstance) {
        this.$uibModalInstance = $uibModalInstance;
        this.config = config;
        this.entity = entity || {};
    }

    add() {
        this.entityForm.$setSubmitted();
        if (this.entityForm.$invalid) {
            return;
        }
        this.$uibModalInstance.close(this.entity);
    }

    confirm() {
        this.$uibModalInstance.close('confirm');
    }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }
}