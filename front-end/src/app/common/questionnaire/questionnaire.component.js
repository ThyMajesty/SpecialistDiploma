import { QuestionnaireController as controller } from './questionnaire.controller';
import template from './questionnaire.template.html';
import styles from './questionnaire.styles.less';

export const QuestionnaireComponent = {
    template,
    controller,
    bindings: {
        questions: '=',
        onChange: '&'
    }
};
