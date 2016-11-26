import './bootstrap.less';
import {AppModule} from './app/app.module';

document.body.addEventListener('DOMContentLoaded', () => {
    angular.bootstrap(document.getElementById(AppModule), [AppModule], {
        strictDi: true
    });
});