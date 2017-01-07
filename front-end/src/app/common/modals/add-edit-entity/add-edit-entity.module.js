import { AddEditEntityFactory } from './add-edit-entity.factory';
import './add-edit-entity.styles.less';

export const AddEditEntityModule = angular.module('erd.common.modals.add-edit-entity', [])
    .factory('addEditEntityModal', AddEditEntityFactory)
    .name;
