export class LoginController {
    constructor(AuthApi, $localStorage) { 
        this.AuthApi = AuthApi;
        this.$storage = $localStorage;
        this.errorMessage = '';
        this.input = {
            username: this.$storage.username,
            password: this.$storage.password,
            rememberMe: true
        }
    }

    submit() {
        this.loginForm.$setSubmitted();
        this.errorMessage = '';
        if (!this.input.username || !this.input.password) {
            return;
        }

        this.AuthApi.login(this.input).then((response) => {
            //console.log(response);
        }, (error) => {
            //console.log(error)
            this.errorMessage = 'Specified login or password is not correct'
        });
    }
}
