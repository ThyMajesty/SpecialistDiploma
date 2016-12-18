import { AddEditEntityFactory } from './add-edit-entity.factory';

export const AddEditEntityModule = angular.module('erd.common.modals.add-edit-entity', [])
    .factory('addEditEntityModal', AddEditEntityFactory)
    .name;
