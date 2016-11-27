import { UserInfoService } from './user-info.service.js';

export const UserInfoModule = angular.module('erd.user-info', [])
    .service('UserInfoService', UserInfoService)
    .name;
