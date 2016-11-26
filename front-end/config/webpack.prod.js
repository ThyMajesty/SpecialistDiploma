const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.common');

const prodStatic = {
    output: {
        path: '../static',
        publicPath: "/",
        filename: "app.js",
    },
    devtool: null,
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}

module.exports = webpackMerge(commonConfig, prodStatic);
