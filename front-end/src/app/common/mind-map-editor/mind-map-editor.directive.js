import template from './mind-map-editor.template.html';
import styles from './mind-map-editor.styles.less';
import { MindMapEditorLogic } from './mind-map-editor.logic';

export function MindMapEditorDirective(addEditEntityModal, BaseApi) {
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
            add: addEditEntityModal({type: 'add', basePk: scope.base.id}).open,
            edit: addEditEntityModal({type: 'edit' , basePk: scope.base.id}).open,
            remove: addEditEntityModal({type: 'remove' , basePk: scope.base.id}).open
        }

        if (!scope.base.tree) {
            scope.base.tree = {
                name: scope.base.name,
                description: scope.base.description
            }
        }

        scope.treeData = mindMapEditor.setTreeData(scope.base.tree);

        function changedTreeData(treeData) {
            //console.log(scope.base.tree, scope.treeData, treeData);
            scope.base.tree = treeData;
            /*BaseApi.editBase(scope.base.id, scope.base).then((response)=>{
                //scope.base = angular.copy(response);
                //console.log(scope.treeData, response);
            });*/
        } 

        mindMapEditor.onChange(changedTreeData);
        mindMapEditor.setDataApi(dataApi);
    }
};
