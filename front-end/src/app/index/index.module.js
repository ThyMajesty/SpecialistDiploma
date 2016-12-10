import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { UserPageModule } from './user-page/user-page.module';
import { IndexComponent } from './index.component';

export const IndexModule = angular.module('erd.index', [
        HeaderModule,
        HomeModule,
        UserPageModule
    ])
    .component('index', IndexComponent)
    .name;
