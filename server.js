const yargs = require('yargs');
const version = require('./package.json').version;
const argv = yargs
    .boolean('dev')
    .alias('dev', ['d'])
    .describe('dev', 'Runs Webpack in dev mode and watch files')

    .boolean('reload')
    .alias('reload', ['r'])
    .describe('reload', 'Reload webpage when change is detected (works ONLY with dev flag)')

    .boolean('no_gzip')
    .alias('no_gzip', ['n'])
    .describe('no_gzip', 'Disable compression with gzip')

    .help()
    .alias('help', 'h')

    .version(version)
    .argv;

const express = require('express');
const app = express();

if(!argv.no_gzip){
    var compression = require('compression');
    app.use(compression());
}

if(argv.dev){
    const webpack = require('webpack');
    if(argv.reload){
        const config = require('./webpack.dev_reload.js');
        const compiler = webpack(config);
        app.use(require("webpack-dev-middleware")(compiler, {
            noInfo: true, publicPath: config.output.publicPath
        }));
        app.use(require("webpack-hot-middleware")(compiler));
    } else {
        const config = require('./webpack.dev.js');
        const compiler = webpack(config);
        app.use(require("webpack-dev-middleware")(compiler, {
            noInfo: true, publicPath: config.output.publicPath
        }));
    }
} else {
    app.use(express.static('dist'));
}

app.get('/api', (req, res) => {
    res.send({
      message: 'Never gonna give you up'
    });
})

app.listen(3000, function () {
  console.log('App listening on port 3000!\n');
});