const HtmlWebpackPlugin = require('html-webpack-plugin')
const SassWebpackPlugin = require('sass-webpack-plugin')
const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    login: './assets/js/login.js'
  },
  output: {
    path: path.join(__dirname, '/.tmp/public'),
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
      template: 'assets/templates/login.html',
      links: [{ rel: 'stylesheet', type: 'text/css', href: 'login.css' }],
      filename: path.join(__dirname, '/.tmp/public/login.html')
    }),
    new SassWebpackPlugin(['assets/styles/login.scss'], process.env.NODE_ENV),
  ]
};
