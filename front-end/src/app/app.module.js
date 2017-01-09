import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { API } from './app.constants';

import { CommonModule } from './common/common.module';

import { AuthModule } from './auth/auth.module';
import { IndexModule } from './index/index.module';

export const AppModule = angular.module('erd', [
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.select',
        'ngStorage',
        'angular-loading-bar',
        'ngAnimate',
        'angular-media-preview',
        'ngFileUpload',
        //'ui.router.components',
        //'angular-sanitize',
        
        CommonModule,
        
        AuthModule,
        IndexModule
    ])
    .config(AppConfig)
    .constant('API', API)
    .component('app', AppComponent)
    .name;
