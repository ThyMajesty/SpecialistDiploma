const srcDir = './src/';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: [`${srcDir}main.js`],
        vendor: ['./vendor.js']
    },
    output: {
        path: './build',
        publicPath: "/",
        filename: "app.js",
    },

    module: {
        /*preLoaders: [
            // Javascript
            { test: /\.js$/, loader: 'eslint-loader', exclude: /(node_modules|bower_components)/ }
        ],*/
        loaders: [{
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }, {
                test: /\.html$/,
                loader: 'raw'
            }, {
                test: /\.js$/,
                loader: 'babel-loader?presets[]=es2015&plugins[]=transform-runtime',
                exclude: /(node_modules|bower_components)/
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            },

            // helps to load bootstrap's css.
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.woff2$/,
                loader: 'url?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&minetype=application/octet-stream'
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&minetype=image/svg+xml'
            }
        ]
    },

    /*eslint: {
        failOnWarning: false,
        failOnError: true
    },*/

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            d3: 'd3',
            rx: 'rx',
            saveAs: 'file-saver',
            jsPDF: 'jspdf',
            saveSvgAsPng: 'save-svg-as-png',
            Masonry: 'Masonry',
            Url: 'domurl'
        }),
        new HtmlWebpackPlugin({
            title: 'ERD',
            template: 'src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        new ExtractTextPlugin("[name].css"),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
    ],
    devtool: 'source-map'
};