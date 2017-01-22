export class AuthController {
    constructor(AuthApi, API) {
        this.AuthApi = AuthApi;
        this.AuthApi.getSocialUrls().then((response) => {
            this.backends = response.data.backends;
        });
    }
}
