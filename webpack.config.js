var path = require('path');

module.exports = {
  entry: './src/fixed-footnotes.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    library: "fixedFootnotes"
  }
};
