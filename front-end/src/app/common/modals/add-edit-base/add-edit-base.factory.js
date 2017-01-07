import { AddEditBaseController as controller } from './add-edit-base.controller';
import template from './add-edit-base.template.html';

export function AddEditBaseFactory($uibModal) {
    return function(config) {
        return {
            open: (base) => {
                const modalInstance = $uibModal.open({
                    animation: true,
                    template: template,
                    controller: controller,
                    controllerAs: '$ctrl',
                    resolve: {
                        base: () => base,
                        config: () => config
                    }
                });
                return modalInstance.result;
            }
        };
    }
}
