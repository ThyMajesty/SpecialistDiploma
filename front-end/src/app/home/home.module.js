import { HomeComponent } from './home.component';

export const HomeModule = angular.module('erd.home', [])
    .component('home', HomeComponent)
    .name;
