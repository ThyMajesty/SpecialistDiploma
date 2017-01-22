export class UserPageController {
    constructor(UserApi, $timeout, API, Upload, $scope) {
        this.UserApi = UserApi;
        UserApi.getUser().then((response)=>{
            //console.log(response);
            this.input = response;
        });
        this.API = API;
        this.Upload = Upload;
        this.$timeout = $timeout;

        $scope.$watch(() => this.picFile, () => {
            this.upload(this.picFile);
        });
    }

    saveChanges() {
        this.userForm.$setSubmitted();
        if (this.userForm.$invalid) {
            return;
        }
        this.UserApi.setUser(this.input);
    }

    upload($file, $invalidFiles) {
        if (!$file || $invalidFiles) {
            return;
        }
        this.Upload.upload({
            url: this.API.filesUpload,
            data: {
                files: [$file]
            },
        }).then((response) => {
            this.$timeout(() => {
                if (Object.keys(response.data.result).length > 0) {
                    this.input.value.image = this.API.fileGet + response.data.result['files[0]'].hash;
                }
            });
        }, (response) => {
            if (response.status > 0) this.errorMsg = response.status 
                + ': ' + response.data;
        }, (evt) => {
            this.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
}
