import { EditBaseModule } from './edit-base/edit-base.module';
import { HeaderModule } from './header/header.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserPageModule } from './user-page/user-page.module';
import { IndexComponent } from './index.component';

export const IndexModule = angular.module('erd.index', [
        EditBaseModule,
        HeaderModule,
        DashboardModule,
        UserPageModule
    ])
    .component('index', IndexComponent)
    .name;
