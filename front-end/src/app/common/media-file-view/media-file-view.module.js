import { MediaFileViewComponent, initAs } from './media-file-view.component';

export const MediaFileViewModule = angular.module('erd.media-file-view', [])
    .component('mediaFileView', MediaFileViewComponent)
    .name;
