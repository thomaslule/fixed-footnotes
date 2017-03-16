var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
  entry: './src/fixed-footnotes.js',
  output: {
    filename: 'fixed-footnotes.js',
    path: path.resolve(__dirname, 'build'),
    library: "fixedFootnotes"
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/fixed-footnotes.css" }])
  ]
};
