import { AddEditEntityModule } from './add-edit-entity/add-edit-entity.module';

export const ModalsModule = angular.module('erd.common.modals', [
        AddEditEntityModule
    ])
    .name;
