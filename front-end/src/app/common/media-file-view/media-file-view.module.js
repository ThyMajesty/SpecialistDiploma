import { MediaFileViewComponent } from './media-file-view.component';

export const MediaFileViewModule = angular.module('erd.media-file-view', [])
    .directive('mediaFileView', MediaFileViewComponent)
    .name;
