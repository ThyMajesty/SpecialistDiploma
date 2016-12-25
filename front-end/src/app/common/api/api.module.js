import { AuthApi } from './auth-api.service';
import { UserApi } from './user-api.service';
import { BaseApi } from './base-api.service';

export const ApiModule = angular.module('erd.common.api', [])
    .service('AuthApi', AuthApi)
    .service('UserApi', UserApi)
    .service('BaseApi', BaseApi)
    .name;
