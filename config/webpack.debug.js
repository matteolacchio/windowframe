const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dev_directory = path.resolve(__dirname, '../development');
const debug_directory = path.resolve(dev_directory, '/debug')

module.exports = {
  mode: 'development',
  entry: path.resolve(dev_directory, 'index.js'),
  output: {
    filename: 'windowframe-debug.js',
    path: debug_directory,
  },
  plugins : [
    new HtmlWebpackPlugin({
      hash: true,
      template: path.resolve(dev_directory, 'index.html'),
      filename : path.resolve(debug_directory, 'index.html'),
    })
  ],
  devServer : {
    compress: true,
    port: 8888,
    static : {
      directory: debug_directory,
    }
  }
};