import { AddEditEntityController as controller } from './add-edit-entity.controller';
import addTemplate from './add-edit-entity.add.template.html';
import removeTemplate from './add-edit-entity.remove.template.html';
import editTemplate from './add-edit-entity.edit.template.html';

const tpls = {
    add: addTemplate,
    remove: removeTemplate,
    edit: editTemplate
};

export function AddEditEntityFactory($uibModal) {
    return function(config) {
        return {
            open: (entity) => {
                const modalInstance = $uibModal.open({
                    animation: true,
                    template: tpls[config.type],
                    controller: controller,
                    controllerAs: '$ctrl',
                    resolve: {
                        entity: () => entity,
                        config: () => config
                    }
                });
                return modalInstance.result/*.then((resolved) => {
                    return resolved;
                }, (rejected) => {
                    return rejected;
                })*/;
            }
        };
    }
}
