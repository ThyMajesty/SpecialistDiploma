//common.module.js
import { ApiModule } from './api/api.module';
import { ModalsModule } from './modals/modals.module';
import { FormGroupValidationModule } from './form-group-validation/form-group-validation.module';
import { MindMapEditorModule } from './mind-map-editor/mind-map-editor.module';
import { MediaFileViewModule } from './media-file-view/media-file-view.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { FiltersModule } from './filters/filters.module';

export const CommonModule = angular.module('erd.common', [
        ApiModule,
        FormGroupValidationModule,
        MindMapEditorModule,
        ModalsModule,
        MediaFileViewModule,
        QuestionnaireModule,
        FiltersModule
    ])
    .name;


