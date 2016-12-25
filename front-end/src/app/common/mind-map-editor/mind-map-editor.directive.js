import template from './mind-map-editor.template.html';
import styles from './mind-map-editor.styles.less';
import { MindMapEditorLogic } from './mind-map-editor.logic';

export function MindMapEditorDirective(addEditEntityModal) {
    return {
        restrict: 'E',
        scope: {
            base: '='
        },
        template: template,
        link
    };

    function link(scope, element, attrs, ctrl) {
        const mindMapElement = angular.element(element[0].getElementsByClassName("mindMap"))[0];
        const mindMapEditor = new MindMapEditorLogic(mindMapElement); //mindMapElement, treeData, settings
        const dataApi = {
            add: addEditEntityModal({type: 'add'}).open,
            edit: addEditEntityModal({type: 'edit'}).open,
            remove: addEditEntityModal({type: 'remove'}).open
        }

        const tree = {
            name: scope.base.name
        }

        scope.treeData = mindMapEditor.setTreeData(tree);

        function changedTreeData(treeData) {
            scope.treeData = treeData;
        } 

        mindMapEditor.onChange(changedTreeData);
        mindMapEditor.setDataApi(dataApi);
    }
};
