import { AuthComponent } from './auth.component';
import { AuthConfig } from './auth.config';
import { MESSAGES } from './auth.constants';

import { LoginModule } from './login/login.module';
import { SignInModule } from './signin/signin.module';

export const AuthModule = angular.module('erd.auth', [
        LoginModule,
        SignInModule
    ])
    .config(AuthConfig)
    .component('auth', AuthComponent)
    .constant('MESSAGES', MESSAGES)
    .name;
