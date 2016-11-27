export function AuthController(AuthApi) {
    this.userData = {};

    this.submit = () => {
        if(!this.userData.username || !this.userData.password) {
            return;
        }

        AuthApi.login(this.userData).then((response) => {
            console.log(response);
        });
    }

    console.log('AuthController', AuthApi);
}