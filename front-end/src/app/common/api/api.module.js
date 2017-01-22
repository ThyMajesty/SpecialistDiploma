import { AuthApi } from './auth-api.service';
import { UserApi } from './user-api.service';
import { BaseApi } from './base-api.service';
import { InstanceApi } from './instance-api.service';
import { ConnectionApi } from './connection-api.service';
import { TokenApi } from './token-api.service';

export const ApiModule = angular.module('erd.common.api', [])
    .service('AuthApi', AuthApi)
    .service('UserApi', UserApi)
    .service('BaseApi', BaseApi)
    .service('ConnectionApi', ConnectionApi)
    .service('InstanceApi', InstanceApi)
    .service('TokenApi', TokenApi)
    .name;
