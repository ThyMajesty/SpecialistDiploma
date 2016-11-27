const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:80',
                secure: false
            }
        }
    }
});
