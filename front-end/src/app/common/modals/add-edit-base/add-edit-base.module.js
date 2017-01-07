import { AddEditBaseFactory } from './add-edit-base.factory';
import './add-edit-base.styles.less';

export const AddEditBaseModule = angular.module('erd.common.modals.add-edit-base', [])
    .factory('addEditBaseModal', AddEditBaseFactory)
    .name;
