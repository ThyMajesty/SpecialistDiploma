export class UserPageController {
    constructor(UserApi) {
        this.UserApi = UserApi;
        UserApi.getUser().then((response)=>{
            //console.log(response);
            this.input = response;
        });
    }

    saveChanges() {
        this.userForm.$setSubmitted();
        if (this.userForm.$invalid) {
            return;
        }
        this.UserApi.setUser(this.input);
    }
}
