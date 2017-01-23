const path = require('path')
const Server = require('./server.js')
const port = (process.env.PORT || 8080)
const app = Server.app()

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const proxyMiddleware = require('http-proxy-middleware');
const config = require('./config/webpack.dev.js')
const devConfig = config.devServer;
config.output.path = __dirname + config.output.path
const compiler = webpack(config)

if (devConfig.proxy) {
    Object.keys(devConfig.proxy).forEach((context) => {
        app.use(proxyMiddleware(context, devConfig.proxy[context]));
    });
}

app.use(webpackHotMiddleware(compiler))
app.use(webpackDevMiddleware(compiler, {
    noInfo: true
}))

app.listen(port)
console.log(`Listening at http://localhost:${port}`)
