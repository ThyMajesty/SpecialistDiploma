export function UserInfoService() {
    let _userInfo = {};

    this.getUserInfo = () => {
        return _userInfo;
    }

    this.setUserInfo = (userInfo) => {
        _userInfo = userInfo || _userInfo;
        return _userInfo;
    }



    function getMockedUserInfo() {
        return {
            firstName: 'Donald',
            lastName: 'Trump',
            email: 'dtrump@trap.com'

        }
    }
    this.setUserInfo(getMockedUserInfo());
}