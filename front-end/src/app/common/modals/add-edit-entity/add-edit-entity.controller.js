export class AddEditEntityController {
    constructor(config, entity, $uibModalInstance, ConnectionApi) {
        this.$uibModalInstance = $uibModalInstance;
        this.ConnectionApi = ConnectionApi;
        this.config = config;
        this.entity = entity || {};
        this.input = this.config.type === 'edit' ? angular.copy(this.entity) : {};
        this.fetchData();
    }

    fetchData() {
        this.ConnectionApi.getConnections().then((response) => {
            this.connections = response;
        });
    }

    selectedConnection($item, $model) {
        if(!this.entity.name) {
            return;
        }
        this.ConnectionApi.getEntityByConnection($item.name + '/' + this.entity.name + '/').then((response) => {
            this.subConnections = response;
        });
    }

    selectedSubConnection($item, $model) {
        if(!$item.name) {
            return;
        }
        this.input.name = $item.name;
        this.input.description = $item.description;
        console.log(this.input);
    }


    add() {
        this.entityForm.$setSubmitted();
        if (this.entityForm.$invalid) {
            return;
        }
        this.$uibModalInstance.close(this.input);
    }

    confirm() {
        this.$uibModalInstance.close('confirm');
    }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }

    refreshResults($select) {
        let search = $select.search,
            list = angular.copy($select.items),
            FLAG = -1;
        list = list.filter(function(item) {
            return item.id !== FLAG;
        });

        if (!search) {
            $select.items = list;
        } else {
            let userInputItem = {
                description: search
            };
            $select.items = [userInputItem].concat(list);
            $select.selected = userInputItem;
        }
    }

    clearSelection($event, $select) {
        $event.stopPropagation();
        $select.selected = undefined;
        $select.search = undefined;
        $select.activate();
    }

}
