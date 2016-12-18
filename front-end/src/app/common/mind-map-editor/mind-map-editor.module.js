//mind-map-editor.module.js
import { MindMapEditorDirective } from './mind-map-editor.directive';

export const MindMapEditorModule = angular.module('erd.common.mind-map-editor', [])
    .directive('mindMapEditor', MindMapEditorDirective)
    .name;
