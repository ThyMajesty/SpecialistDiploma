const srcDir = './src/';

module.exports = {
    entry: `${srcDir}app.js`,
    output: {
        path: './dist',
        filename: 'app.js'
    },

    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css"
        }]
    },

    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    ]
};