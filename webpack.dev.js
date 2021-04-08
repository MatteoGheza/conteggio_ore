const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.EnvironmentPlugin({
      BUNDLE_ENV: "dev",
      BUNDLE_DATE: new Date(),
      RELOAD: false
    })
  ]
});