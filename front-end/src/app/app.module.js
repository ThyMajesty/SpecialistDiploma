import {
    HeaderModule
} from './header/header.module';

import {
    AppComponent
} from './app.component';

export const AppModule = angular.module('erd', [
        'ui.router',
        'ui.bootstrap',
        'ui.select',

        HeaderModule,

    ])
    .component('app', AppComponent)
    .name;