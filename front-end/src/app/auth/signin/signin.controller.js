export class SignInController {
    constructor(AuthApi, MESSAGES) {
        this.AuthApi = AuthApi;
        this.userData = {};
        this.errorMap = MESSAGES.error;
        this.errorMessage = '';
    }

    submit() {
        let fields = ['username', 'password', 'email', 'confirm-password'];
        this.singInForm.$setSubmitted();
        //this.singInForm[username].$invalid
        if (this.singInForm.$invalid) {
            return;
        }
        this.AuthApi.signup(this.userData).then((response) => {
            console.log(this.userData)
            //console.log(response);
        });
    }
}
