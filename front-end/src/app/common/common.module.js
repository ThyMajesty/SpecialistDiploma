//common.module.js
import { ApiModule } from './api/api.module';
import { FormGroupValidationModule } from './form-group-validation/form-group-validation.module';

export const CommonModule = angular.module('erd.common', [
        ApiModule,
        FormGroupValidationModule
    ])
    .name;
