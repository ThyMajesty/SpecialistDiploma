import { MediaFileViewController as controller } from './media-file-view.controller';
import template from './media-file-view.template.html';
import styles from './media-file-view.styles.less';

export function MediaFileViewComponent() {
    return {
        template,
        scope: {
            files: '=',
            model: '=ngModel',
            onChange: '&'
        },
        link: _link   
    }
};

function _link(scope, elem, attrs) {

    var $input = angular.element(elem.children().eq(0));

    var ngModel = $input.controller('ngModel');

    var container;

    var fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA00lEQVR4Ae2XwQqDQAxEveinFD9e2MUfq6Cep7GnrPAg1JVCu5OTvEwe9FLtWlpqR6OyVn2aXbNGdX6KB4OLrmbRyIKsGsksWKsINhbUShM0wVcEk43CnAVY722mMEfBhPWD9mGOAlvBepSDwK1gPc5LASp8fbCJ81KACl9PNkOYo8CfKOtHUpijwJ841y1xToJy5VxXnLPgvUL1OAeBW4F6kKPAnYB6jKPAnYA68PZ/8EOCJtjvfvmdqwjSvR8gTz1YcCiytgs/TvLnvaDi/J2gCV63ZgZdEb12DwAAAABJRU5ErkJggg==";

    var previewClass = attrs.previewClass || 'media-preview';

    var containerClass = attrs.containerClass || 'media-container';

    if (typeof attrs.multiple !== 'undefined' && attrs.multiple != 'false') {
        $input.attr('multiple', true);
    }

    if (!attrs.previewContainer || (!document.getElementById(attrs.previewContainer) && !angular.isElement(attrs.previewContainer))) {

        container = angular.element(document.createElement('div'));

        elem.parent()[0].insertBefore(container[0], elem[0]);

    } else {

        container = angular.isElement(attrs.previewContainer) ? attrs.previewContainer : angular.element(document.getElementById(attrs.previewContainer));
    }

    container.addClass(containerClass);

    if (scope.files) {
        console.log(scope.files)
        scope.files.map((el) => {
            let $mediaElement, deleteFileBtn, innerContainer;
            
            innerContainer = angular.element(document.createElement('div'))
                innerContainer.addClass('inner-container col-md-6');

            if (el.result.indexOf('data:audio') > -1) {

                $mediaElement = angular.element(document.createElement('audio'));
                $mediaElement.attr('controls', 'true');

            } else if (el.result.indexOf('data:video') > -1) {

                $mediaElement = angular.element(document.createElement('video'));
                $mediaElement.attr('controls', 'true');

            } else {

                $mediaElement = angular.element(document.createElement('img'));

            }  
            //$mediaElement.attr('id', data.lastModified)
            

            $mediaElement.attr('src', el.result);
            $mediaElement.addClass(previewClass);

            deleteFileBtn = document.createElement('i');
            deleteFileBtn = angular.element(deleteFileBtn)
            deleteFileBtn.addClass('delete-file glyphicon glyphicon-remove btn btn-default');

            deleteFileBtn.on('click', (event) => {
                scope.files[index] = undefined;
            })

            innerContainer.append($mediaElement);
            innerContainer.append(deleteFileBtn);
            container.append(innerContainer);
        });
    }

    function onChange(e) {

        var files = $input[0].files,
            b64 = [];

        attrs.multiple ? ngModel.$setViewValue(files) : ngModel.$setViewValue(files[0]);

        container.empty();

        if (files && files.length) {

            angular.forEach(files, function(data, index) {

                var $reader = new FileReader(),
                    result, $mediaElement, deleteFileBtn;

                $reader.onloaderror = function(e) {
                    result = fallbackImage;
                }

                $reader.onload = function(e) {
                    result = e.target.result;
                }

                $reader.onloadend = function(e) {

                    let innerContainer = angular.element(document.createElement('div'))
                        innerContainer.addClass('inner-container col-md-6');

                    if (result.indexOf('data:audio') > -1) {

                        $mediaElement = angular.element(document.createElement('audio'));
                        $mediaElement.attr('controls', 'true');

                    } else if (result.indexOf('data:video') > -1) {

                        $mediaElement = angular.element(document.createElement('video'));
                        $mediaElement.attr('controls', 'true');

                    } else {

                        $mediaElement = angular.element(document.createElement('img'));

                    }  
                    $mediaElement.attr('id', data.lastModified)
                    

                    $mediaElement.attr('src', result);
                    $mediaElement.addClass(previewClass);

                    deleteFileBtn = document.createElement('i');
                    deleteFileBtn = angular.element(deleteFileBtn)
                    deleteFileBtn.addClass('delete-file glyphicon glyphicon-remove btn btn-default');

                    deleteFileBtn.on('click', (event) => {
                        console.log(data)
                        files[index] = undefined;
                    })

                    innerContainer.append($mediaElement);
                    innerContainer.append(deleteFileBtn);
                    container.append(innerContainer);

                    b64.push({   
                        result: $reader.result
                    });

                    scope.files = angular.copy(b64);
                    scope.onChange({
                        files: angular.copy(b64)
                    });

                }
                console.log($reader)
                $reader.readAsDataURL(data);

            });

        }



    }

    scope.clearPreview = function() {
        $input.val('');
        container.empty();
    }

    elem.on('change', onChange);

    scope.$on('$destroy', function() {
        elem.off('change', onChange);
    });

}
