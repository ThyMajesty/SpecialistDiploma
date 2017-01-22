import { ShortenFilenameFilter } from './shorten-filename.filter';

export const FiltersModule = angular.module('erd.common.filters', [])
    .filter('shortenFilename', ShortenFilenameFilter)
    
    .name;
