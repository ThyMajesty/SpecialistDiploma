import { SignInComponent } from './signin.component';

export const SignInModule = angular.module('erd.auth.signin', [])
    .component('signin', SignInComponent)
    .name;
