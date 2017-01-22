export class AddEditEntityController {
    constructor(config, entity, $uibModalInstance, ConnectionApi, InstanceApi) {
        this.$uibModalInstance = $uibModalInstance;
        this.ConnectionApi = ConnectionApi;
        this.InstanceApi = InstanceApi;
        this.config = config;
        this.entity = entity || {};
        this.input = ['edit', 'remove'].indexOf(this.config.type) > -1 ? angular.copy(this.entity) : { value: {} };
        this.fetchData();

        this.inputType = {
            auto: true,
            manual: false
        };
    }

    fetchData() {
        this.ConnectionApi.getConnections(this.entity.value.name).then((response) => {
            this.connections = response;
        });
    }

    selectedConnection($item) {
        if (!this.entity.value.name) {
            return;
        }
        this.ConnectionApi.getEntityByConnection($item.name + '/' + this.entity.value.name).then((response) => {
            if (!response.result) {
                this.subConnections = [];
                this.inputType = {
                    auto: false,
                    manual: true
                };
                return;
            }
            this.subConnections = response.result;
        });
    }

    selectedSubConnection($item) {
        if (!$item.name) {
            return;
        }
        this.input.value.name = $item.name;
        this.input.value.description = $item.description;
    }


    add() {
        this.entityForm.$setSubmitted();
        if (this.entityForm.$invalid) {
            return;
        }
        if (this.config.basePk) {
            if (this.config.type === 'add') {
                this.input.parent_id = this.entity.id;
                this.InstanceApi.addInstance(this.config.basePk, this.input).then((response) => {
                    this.input.id = response.id;
                    this.$uibModalInstance.close(this.input);
                })
            }
            if (this.config.type === 'edit') {
                this.InstanceApi.editInstance(this.config.basePk, this.input).then((response) => {
                    console.log(response, this.input)
                    this.$uibModalInstance.close(this.input);
                })
            }
            if (this.config.type === 'remove') {
                this.InstanceApi.addInstance(this.config.basePk, this.input).then((response) => {
                    this.$uibModalInstance.close(this.input);
                })
            }
        }

    }

    confirm() {
        this.InstanceApi.deleteInstance(this.config.basePk, this.input).then((response) => {
            this.$uibModalInstance.close(this.input);
        })
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

    filesChanged(files, b64) {
        console.log('filesChanged', this.input.value, files, b64);
        this.input.value.files = files || b64;
    }

}
