import { UserPageComponent } from './user-page.component';

export const UserPageModule = angular.module('erd.user-page', [])
    .component('user-page', UserPageComponent)
    .name;
