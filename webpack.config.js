const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = (env, argv) => {
  const mode = argv.mode || 'development'

  return {
    mode: mode || 'development',
    entry: {
      login: './assets/js/login.js',
      targets: './assets/js/targets.js'
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
            mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'assets/templates/login.html',
        links: mode === 'production' ? [{ rel: 'stylesheet', type: 'text/css', href: 'login.css' }] : [],
        filename: path.join(__dirname, '/.tmp/public/login.html'),
        chunks: ['login']
      }),
      new HtmlWebpackPlugin({
        template: 'assets/templates/targets.html',
        links: mode === 'production' ? [{ rel: 'stylesheet', type: 'text/css', href: 'targets.css' }] : [],
        filename: path.join(__dirname, '/.tmp/public/targets.html'),
        chunks: ['targets']
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode)
      })
    ]
  }
}
