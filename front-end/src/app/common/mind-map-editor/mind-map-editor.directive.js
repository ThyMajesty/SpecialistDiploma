import template from './mind-map-editor.template.html';
import styles from './mind-map-editor.styles.less';
import { MindMapEditorTreeLogic } from './mind-map-editor.tree.logic';
import { MindMapEditorTreeMapLogic } from './mind-map-editor.treemap.logic';

export function MindMapEditorDirective(addEditEntityModal, BaseApi) {
    return {
        restrict: 'E',
        scope: {
            base: '=',
            type: '='
        },
        template: template,
        link
    };

    function link(scope, element, attrs, ctrl) {

        const mindMapElement = angular.element(element[0].getElementsByClassName("mindMap"))[0];
        const dataApi = {
            add: addEditEntityModal({type: 'add', basePk: scope.base.id}).open,
            edit: addEditEntityModal({type: 'edit' , basePk: scope.base.id}).open,
            remove: addEditEntityModal({type: 'remove' , basePk: scope.base.id}).open
        };
        let mindMapEditor = {};
        if (!scope.base.tree) {
            scope.base.tree = {
                name: scope.base.name,
                description: scope.base.description
            }
        }
        function changedTreeData(treeData) {
            scope.base.tree = treeData;
        } 

        if (scope.type == 'tree') {
            mindMapEditor = new MindMapEditorTreeLogic(mindMapElement); //mindMapElement, treeData, settings
            scope.treeData = mindMapEditor.setTreeData(scope.base.tree);
            mindMapEditor.onChange(changedTreeData);
            mindMapEditor.setDataApi(dataApi);
        }
        if (scope.type == 'treemap') {
            mindMapEditor = new MindMapEditorTreeMapLogic(mindMapElement, angular.copy(scope.base.tree)); //mindMapElement, treeData, settings
        }


        //console.log(scope.base.tree)

        

        scope.export = (format, scale) => {
            format = format || 'png'; 
            scale = scale || 20;
            mindMapEditor.export(format, scale);
        }

        /*scope.export = function(){
            var svg = document.querySelector( "svg" );
            var svgData = new XMLSerializer().serializeToString( svg );

            var canvas = document.createElement( "canvas" );
            var ctx = canvas.getContext( "2d" );

            var img = document.createElement( "img" );
            img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );

            img.onload = function() {
                ctx.drawImage( img, 0, 0 );
                
                // Now is done
                console.log( canvas.toDataURL( "image/png" ) );
            };
        }*/
    }


};
