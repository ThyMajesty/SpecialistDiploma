import {
    HeaderComponent
} from './header.component';

export const HeaderModule = angular.module('erd.header', [])
    .component('header', HeaderComponent)
    .name;