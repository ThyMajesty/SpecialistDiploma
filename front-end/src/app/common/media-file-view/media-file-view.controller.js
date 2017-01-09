export class MediaFileViewController {
    constructor(API, Upload, $timeout) {
        this.API = API;
        this.Upload = Upload;
        this.$timeout = $timeout;
        this.fallbackImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA00lEQVR4Ae2XwQqDQAxEveinFD9e2MUfq6Cep7GnrPAg1JVCu5OTvEwe9FLtWlpqR6OyVn2aXbNGdX6KB4OLrmbRyIKsGsksWKsINhbUShM0wVcEk43CnAVY722mMEfBhPWD9mGOAlvBepSDwK1gPc5LASp8fbCJ81KACl9PNkOYo8CfKOtHUpijwJ841y1xToJy5VxXnLPgvUL1OAeBW4F6kKPAnYB6jKPAnYA68PZ/8EOCJtjvfvmdqwjSvR8gTz1YcCiytgs/TvLnvaDi/J2gCV63ZgZdEb12DwAAAABJRU5ErkJggg==`;
        
        this.filesToPreview = [];
        if (this.files && this.files.length){
            this.filesToPreview = angular.copy(this.files).map((el) => {
                el.file = {
                    name: el.name
                }
                return el;
            });
        }
        this.filesRaw = [];
    }

    selectFiles(files, errFiles) {
        this.errFiles = errFiles;

        if (!(files && files.length)) {
            this.errorMsg = 'No file chosen';
            return console.log(this.errorMsg);
        }
        //TODO: validation

        this.filesRaw = this.filesRaw.concat(files);
        this.filesToPreview = [];

        this.onChange({
            files: this.filesRaw,
            b64: this.filesToPreview.map((el) => { return {
                src: el.src,
                type: el.type,
                name: el.file.name
            };})
        });


        angular.forEach(this.filesRaw, (file) => {
            this.Upload.base64DataUrl(file).then((b64) => {
                this.filesToPreview.push({
                    type: b64.split('data:')[1].split('/')[0],
                    src: b64,
                    file: file
                });
                this.onChange({
                    files: this.filesRaw,
                    b64: this.filesToPreview.map((el) => { return {
                        src: el.src,
                        type: el.type,
                        name: el.file.name
                    };})
                });
            });
        });

        /*angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        });*/
    }

    uploadFiles() {
        if (!(this.filesRaw && this.filesRaw.length > 0)) {
            return;
        }
        this.Upload.upload({
            url: this.API.filesUpload,
            data: {
                files: this.filesRaw
            },
            //method: 'PUT'
        }).then((response) => {
            this.$timeout(() => {
                this.uploadedFiles = [];
                angular.forEach(response.result, (el) => {
                    this.uploadedFiles.push(el);
                });
                console.log(this.filesRaw, response)
                this.onChange({
                    files: this.uploadedFiles,
                    b64: this.filesToPreview.map((el) => { return {
                        src: el.src,
                        type: el.type,
                        name: el.file.name
                    };})
                });
            });
        }, (response) => {
            if (response.status > 0) {
                this.errorMsg = response.status + ': ' + response.data;
            }
        }, (evt) => {
            this.uploadProgress = 
                Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                console.log(this.uploadProgress);
        });
    }

    clearPreview() {
        this.filesRaw = [];
        this.filesToPreview = [];
        this.onChange({
            files: this.filesRaw,
            b64: this.filesToPreview.map((el) => { return {
                src: el.src,
                type: el.type,
                name: el.file.name
            };})
        });
    }

    deleteFile(file, index) {
        if (index > -1){
            this.filesToPreview.splice(index, 1);
        }

        let fInd = this.filesRaw.findIndex((el) => {
            return (el.name + el.lastModified) === (file.file.name + file.file.lastModified)
        }); 
        
        if (fInd > -1) {
            this.filesRaw.splice(fInd, 1);
        }
        this.onChange({
            files: this.filesRaw,
            b64: this.filesToPreview.map((el) => { return {
                src: el.src,
                type: el.type,
                name: el.file.name
            };})
        });
    }
}
