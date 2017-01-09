import { MediaFileViewController as controller } from './media-file-view.controller';
import template from './media-file-view.template.html';
import styles from './media-file-view.styles.less';

export const MediaFileViewComponent = {
    template,
    controller,
    bindings: {
        files: '=',
        onChange: '&'
    }
};
