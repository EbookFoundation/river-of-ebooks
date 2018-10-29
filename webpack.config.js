const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'assets/templates/login.html',
      links: process.env.NODE_ENV === 'production' ? [{ rel: 'stylesheet', type: 'text/css', href: 'login.css' }] : [],
      filename: path.join(__dirname, '/.tmp/public/login.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}
