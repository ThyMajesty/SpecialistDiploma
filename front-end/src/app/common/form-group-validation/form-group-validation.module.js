//form-group-validation.module.js
import { FormGroupValidationDirective } from './form-group-validation.directive';

export const FormGroupValidationModule = angular.module('erd.common.form-group-validation', [])
    .directive('formGroupValidation', FormGroupValidationDirective)
    .name;
