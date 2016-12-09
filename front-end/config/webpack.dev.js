const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    devServer: {
        proxy: {
            '/authorize': {
                target: 'http://localhost:80/api/token-auth/',
                secure: false
            },
            '/api': {
                target: 'http://api.localhost:80/v1/',
                secure: false
            },
            
        }
    }
});
