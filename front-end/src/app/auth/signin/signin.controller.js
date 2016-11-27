export function SignInController(AuthApi) {
    let vm = this;

    Object.assign(vm, {
        userData: {},
        submit
    });

    function submit() {
        if (!vm.userData.username || !vm.userData.password) {
            return;
        }
        AuthApi.signin(vm.userData).then((response) => {
            console.log(response);
        });
    }
}
