//form-group-validation.directive.js
export function FormGroupValidationDirective() {
    return {
        restrict: 'A',
        require: '^form',
        link
    };

    function link(scope, element, attrs, formCtrl) {

        
        const subject = (element.find('input')[0] || element.find('textarea')[0] || element.find('.ui-select-container')[0]).name;
        let removeWatch = scope.$watch(function() {
            return [
                formCtrl.$submitted,
                formCtrl[subject].$dirty,
                formCtrl[subject].$touched,
                formCtrl[subject].$invalid
            ];
        }, validate, true);

        function validate() {
            element.toggleClass('has-error', 
                (formCtrl.$submitted || formCtrl[subject].$dirty || formCtrl[subject].$touched) && 
                formCtrl[subject].$invalid);
        }

        scope.$on('$destroy', ()=>{
            removeWatch();
        });
    }
};
