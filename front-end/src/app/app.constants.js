const domain = 'http://localhost:80/'

const API = {
    //API: 'http://api.localhost:80/v1/',
    AUTH: `${domain}api/token-auth/`,
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
};

export { API }