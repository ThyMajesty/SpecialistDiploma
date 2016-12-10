export class UserPageController {
    constructor(UserApi) {
        this.UserApi = UserApi;
        UserApi.getUser('9d3f1dc8-9107-4c31-9c55-863756768740').then((response)=>{
            //console.log(response);
            this.input = response;
        });
    }

    saveChanges() {
        this.userForm.$setSubmitted();
        this.UserApi.setUser('9d3f1dc8-9107-4c31-9c55-863756768740', this.input);
    }
}
