const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');

const buildStatic = {
    output: {
        path: '../static',
        publicPath: "/",
        filename: "app.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack Starter Angular - kitconcept',
            template: 'src/index.html',
            minify: {
                collapseWhitespace: false,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        })
    ],
}

module.exports = webpackMerge(commonConfig, buildStatic);