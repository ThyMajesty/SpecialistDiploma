const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    devServer: {
        proxy: {
            '/v1': {
                target: 'http://localhost',
                secure: false,
                ws: true,
                pathRewrite: {"^/v1" : ""}
            },
            
        }
    }
});
