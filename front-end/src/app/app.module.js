import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { API } from './app.constants';

import { AuthModule } from './auth/auth.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { UserInfoModule } from './user-info/user-info.module';
import { UserPageModule } from './user-page/user-page.module';

export const AppModule = angular.module('erd', [
        'ui.router',
        'ui.bootstrap',
        'ui.select',
        'ngStorage',
        'ngResource',

        AuthModule,
        HomeModule,
        HeaderModule,
        UserInfoModule,
        UserPageModule,
    ])
    .config(AppConfig)
    .constant('API', API)
    .component('app', AppComponent)
    .name;
