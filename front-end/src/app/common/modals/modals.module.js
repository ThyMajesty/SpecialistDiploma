import { AddEditEntityModule } from './add-edit-entity/add-edit-entity.module';
import { AddEditBaseModule } from './add-edit-base/add-edit-base.module';

export const ModalsModule = angular.module('erd.common.modals', [
        AddEditEntityModule,
        AddEditBaseModule
    ])
    .name;
