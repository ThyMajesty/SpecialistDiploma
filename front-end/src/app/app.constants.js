const domain = `../v1/`

let baseUri = document.body.baseURI;
console.log(baseUri, domain)
console.log(location.host);
console.log(location.hostname);

const API = {
    AUTH: `${domain}api/token-auth/`,
    tokenRefresh: `${domain}api/token-refresh/`,
    tokenVerify: `${domain}api/token-verify/`,
    SIGNUP: `${domain}reg/`,
    GOOGLE_OAUTH: `${domain}login/google-oauth2/`,
    USER: `${domain}api/me/`,
    knowlagedb: `${domain}api/knowlagedb/`,
    testdb: `${domain}api/knowlagedb/`,
    instance: `${domain}api/instance/`,
    pack: `${domain}api/pack/`,
    person: `${domain}api/person/`,
    connection: `${domain}api/connection/`,
    generateEntity: `${domain}api/askfor/`,
    fileUpload: `${domain}upload/`,
    filesUpload: `${domain}uploads/`,
    fileGet: `${domain}media/`,
};

export { API }