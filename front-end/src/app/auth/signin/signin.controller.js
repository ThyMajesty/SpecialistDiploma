export class SignInController {
    constructor(AuthApi, MESSAGES) {
        this.AuthApi = AuthApi;
        this.userData = {};
        this.errorMap = MESSAGES.error;
        this.errorMessage = '';
    }

    submit() {
        this.errorMessage = '';
        let fields = ['username', 'password', 'email', 'confirm-password'];
        this.singInForm.$setSubmitted();

        fields.forEach((el) => {
            if (this.singInForm[el].$invalid) {
                this.errorMessage = this.errorMap[el] || this.errorMap.general;
                return;
            }
        });

        if (this.singInForm.$invalid) {
            return;
        }
        this.AuthApi.signup(this.userData).then((response) => {
            console.log(this.userData)
            //console.log(response);
        });
    }
}
