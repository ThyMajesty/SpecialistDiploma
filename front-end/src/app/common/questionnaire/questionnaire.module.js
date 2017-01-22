import { QuestionnaireComponent } from './questionnaire.component';

export const QuestionnaireModule = angular.module('erd.common.questionnaire', [])
    .component('questionnaire', QuestionnaireComponent)
    .name;
