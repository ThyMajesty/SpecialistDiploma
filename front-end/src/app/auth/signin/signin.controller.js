export class SignInController {
    constructor(AuthApi) {
        this.AuthApi = AuthApi;
        this.userData = {};
    }

    submit() {
        console.log(this.userData)
        this.singInForm.$setSubmitted();
        if (!this.userData.username || !this.userData.password) {
            return;
        }
        this.AuthApi.signin(this.userData).then((response) => {
            console.log(this.userData)
            //console.log(response);
        });
    }
}
