import { UserPageComponent } from './user-page.component';

export const UserPageModule = angular.module('erd.index.user-page', [])
    .component('userPage', UserPageComponent)
    .name;
