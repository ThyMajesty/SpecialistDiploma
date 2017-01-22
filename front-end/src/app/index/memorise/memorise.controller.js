export class MemoriseController {
    constructor(BaseApi, $timeout, $stateParams) {
        this.BaseApi = BaseApi;
        this.baseId = $stateParams.baseId;
        this.questionnaire = {};
        if (this.baseId) {
            this.BaseApi.getBase(this.baseId).then((response) => {
                this.base = response.data || this.base;
            });
        }
    }

    getQuestionnaire() {

    }
}
