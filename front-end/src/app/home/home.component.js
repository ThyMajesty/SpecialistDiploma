import {HomeController as controller} from './home.controller';
import template from './home.template.html';
import styles from './home.styles.less';

export const HomeComponent = {
    bindings: { userInfo: '<' },
    template,
    controller
};
