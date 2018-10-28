const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    login: './assets/js/login.js'
  },
  output: {
    path: __dirname + '/.tmp/public',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'assets/templates/login.html'
    })
  ]
};
