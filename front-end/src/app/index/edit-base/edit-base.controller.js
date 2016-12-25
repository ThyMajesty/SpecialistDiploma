export class EditBaseController {
    constructor(BaseApi) {
        this.BaseApi = BaseApi;

        if (!(this.base && this.base.pk)) {
            this.base = {
                value: {
                    name: '',
                    description: ''
                }
            }
        }
        console.log(this.base);
    }

    saveChanges() {
        this.editBaseForm.$setSubmitted();
        if (this.editBaseForm.$invalid) {
            return;
        }
        if (this.base.pk) {
            this.BaseApi.editBase(this.base.pk, this.base);
            return;
        }
        this.BaseApi.createBase(this.base);
    }
}
