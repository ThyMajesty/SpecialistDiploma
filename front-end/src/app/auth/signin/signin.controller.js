export class SignInController {
    constructor(AuthApi) {
        this.AuthApi = AuthApi;
        this.input = {};
    }

    submit() {
        this.singInForm.$setSubmitted();
        if (!this.input.username || !this.input.password) {
            return;
        }
        this.AuthApi.signin(this.input).then((response) => {
            console.log(response);
        });
    }
}
