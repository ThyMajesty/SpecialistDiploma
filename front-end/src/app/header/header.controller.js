export function HeaderController(UserInfoService) {

    this.userInfo = UserInfoService.getUserInfo();
    //console.log('header loaded, user info:', UserInfoService.getUserInfo());
}