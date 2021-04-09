const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || './';

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/main.js')
  },
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].bundle.js?h=[chunkhash]",
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: ASSET_PATH,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Conteggio ore',
      filename: 'index.html',
      template: './src/index.html',
      'meta': {
        'charset': 'utf-8',
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.xlsx$/i,
        type: 'asset/resource',
      },
    ],
  },
};