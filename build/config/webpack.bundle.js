const path = require('path');

const dist_directory = path.resolve(__dirname, '../../dist');
const lib_directory = path.resolve(__dirname, '../../lib');

module.exports = {
  mode: 'production',
  entry: path.resolve(lib_directory, 'windowframe-lib.js'),
  output: {
    filename: 'index.js',
    path: dist_directory,
    libraryTarget: 'umd',
  },
};