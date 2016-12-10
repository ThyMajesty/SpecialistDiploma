import { HeaderComponent } from './header.component';

export const HeaderModule = angular.module('erd.index.header', [])
    .component('header', HeaderComponent)
    .name;
