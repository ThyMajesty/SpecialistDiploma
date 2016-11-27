export function AuthController(AuthApi) {
    this.userData = {};

    this.submit = () => {
        if(!this.userData.username || !this.userData.password) {
            return;
        }

        AuthApi.login(this.userData).then((response) => {
            console.log(response);
            AuthApi.postDb({}).then((tmp) => {
                console.log(tmp);
            })
        });
    }

    console.log('AuthController', AuthApi);
}