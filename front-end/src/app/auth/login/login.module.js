import { LoginComponent } from './login.component';

export const LoginModule = angular.module('erd.auth.login', [])
    .component('login', LoginComponent)
    .name;
