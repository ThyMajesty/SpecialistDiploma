export function LoginController(AuthApi, $localStorage) {
    let vm = this;
    const { username, password } = $localStorage;
    
    Object.assign(vm, {
        userData: { username, password },
        submit
    });

    function submit() {
        if (!vm.userData.username || !vm.userData.password) {
            return;
        }
        AuthApi.login(vm.userData).then((response) => {
            console.log(response);
        });
    }
}
