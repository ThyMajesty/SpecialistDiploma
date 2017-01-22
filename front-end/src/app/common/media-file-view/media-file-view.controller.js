export class MediaFileViewController {
    constructor(API, Upload, $timeout, $scope) {
        this.API = API;
        this.Upload = Upload;
        this.$timeout = $timeout;
        this.fallbackImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA00lEQVR4Ae2XwQqDQAxEveinFD9e2MUfq6Cep7GnrPAg1JVCu5OTvEwe9FLtWlpqR6OyVn2aXbNGdX6KB4OLrmbRyIKsGsksWKsINhbUShM0wVcEk43CnAVY722mMEfBhPWD9mGOAlvBepSDwK1gPc5LASp8fbCJ81KACl9PNkOYo8CfKOtHUpijwJ841y1xToJy5VxXnLPgvUL1OAeBW4F6kKPAnYB6jKPAnYA68PZ/8EOCJtjvfvmdqwjSvR8gTz1YcCiytgs/TvLnvaDi/J2gCV63ZgZdEb12DwAAAABJRU5ErkJggg==`;
        this.tmpl = '<img ng-src="{{card.src}}">';
        this.mas = $('.grid').masonry({
                    itemSelector: '.grid-item',
                    columnWidth: '.grid-sizer',
                    percentPosition: true
                });
        this.filesToPreview = [];
        if (this.files && this.files.length) {
            this.filesToPreview = angular.copy(this.files).map((el) => {
                if (!el.src.startsWith('data')) {
                    el.src = this.API.fileGet + el.src;
                }
                el.file = {
                    name: el.name
                }
                return el;
            });
        }
        this.filesRaw = [];
        this.filesToUploadAndPreview = [];

        $scope.$watch(() => this.filesToUploadAndPreview, () => {
            console.log(this.filesToUploadAndPreview);
            this.selectFiles(this.filesToUploadAndPreview);
        });
    }

    selectFiles(files, errFiles) {
        this.errFiles = errFiles;

        if (!(files && files.length) || errFiles) {
            this.errorMsg = 'No file chosen';
            return;
        }
        //TODO: validation

        this.filesRaw = this.filesRaw.concat(files);
        this.filesToPreview = [];

        this.onChange({
            files: this.filesRaw,
            b64: this.filesToPreview.map((el) => {
                return {
                    src: el.src,
                    type: el.type,
                    name: el.file.name,
                    id: el.file.name
                };
            })
        });

        this.uploadFiles();

        angular.forEach(this.filesRaw, (file) => {
            this.Upload.base64DataUrl(file).then((b64) => {
                this.filesToPreview.push({
                    type: b64.split('data:')[1].split('/')[0],
                    src: b64,
                    file: file,
                    id: file.name
                });
                this.mas.masonry('layout');
                this.onChange({
                    files: this.filesRaw,
                    b64: this.filesToPreview.map((el) => {
                        return {
                            src: el.src,
                            type: el.type,
                            name: el.file.name,
                            id: el.file.name
                        };
                    })
                });

            });
        });
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
        }).then((response) => {
            this.$timeout(() => {
                this.uploadedFiles = [];
                angular.forEach(response.data.result, (el) => {
                    this.uploadedFiles.push({
                        src: el.hash,
                        type: el.mimetype.split('/')[0],
                        name: el.hash
                    });
                });
                this.onChange({
                    files: this.uploadedFiles,
                    b64: this.filesToPreview.map((el) => {
                        return {
                            src: el.src,
                            type: el.type,
                            name: el.file.name,
                            id: el.file.name
                        };
                    })
                });
            });
        }, (response) => {
            if (response.status > 0) {
                this.errorMsg = response.status + ': ' + response.data;
            }
        }, (evt) => {
            this.uploadProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    clearPreview() {
        this.filesRaw = [];
        this.filesToPreview = [];
        this.onChange({
            files: this.filesRaw,
            b64: this.filesToPreview.map((el) => {
                return {
                    src: el.src,
                    type: el.type,
                    name: el.file.name,
                    id: el.file.name
                };
            })
        });
    }

    deleteFile(file, index) {
        if (index > -1) {
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
            b64: this.filesToPreview.map((el) => {
                return {
                    src: el.src,
                    type: el.type,
                    name: el.file.name,
                    id: el.file.name
                };
            })
        });
    }

    downloadFile(file, index) {
        console.log(file, index, this)
    }
}
