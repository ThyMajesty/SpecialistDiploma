
import { DashboardComponent } from './dashboard.component';

export const DashboardModule = angular.module('erd.index.dashboard', [])
    .component('dashboard', DashboardComponent)
    .name;
