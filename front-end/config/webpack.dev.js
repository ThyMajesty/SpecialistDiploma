const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    devServer: {
        proxy: {
            '/authorize': {
                target: 'http://localhost:8000/api/token-auth/',
                secure: false
            },
            '/api': {
                target: 'http://api.localhost:8000/v1/',
                secure: false
            },
            
        }
    }
});
