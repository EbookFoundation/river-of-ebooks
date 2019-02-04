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
      index: './assets/js/index.js'
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
        template: 'assets/templates/index.html',
        links: mode === 'production' ? [{ rel: 'stylesheet', type: 'text/css', href: 'index.css' }] : [],
        filename: path.join(__dirname, '/.tmp/public/index.html'),
        chunks: ['index']
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode)
      })
    ],
    devServer: {
      historyApiFallback: true,
      disableHostCheck: true,
      port: 8080
    }
  }
}
