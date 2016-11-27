import { AuthComponent } from './auth.component';
import { AuthApi } from './auth.factory';

export const AuthModule = angular.module('erd.auth', [])
    .component('auth', AuthComponent)
    .factory('AuthApi', AuthApi)
    .name;
