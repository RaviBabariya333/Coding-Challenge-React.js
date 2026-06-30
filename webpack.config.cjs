const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
require('dotenv').config()

module.exports = (_env, argv) => {
  const isDev = argv.mode === 'development'

  return {
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash].js',
      chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'public', to: '.' }],
      }),
      new webpack.DefinePlugin({
        'import.meta.env.DEV': JSON.stringify(isDev),
        'import.meta.env.PROD': JSON.stringify(!isDev),
        'import.meta.env.MODE': JSON.stringify(isDev ? 'development' : 'production'),
        'import.meta.env.VITE_GOOGLE_BOOKS_API_KEY': JSON.stringify(
          process.env.VITE_GOOGLE_BOOKS_API_KEY ?? '',
        ),
      }),
    ],
    devServer: {
      host: '127.0.0.1',
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      proxy: [
        {
          context: ['/api/books'],
          target: 'https://www.googleapis.com',
          changeOrigin: true,
          secure: true,
          pathRewrite: { '^/api/books': '/books/v1/volumes' },
          onProxyReq(proxyReq, req) {
            const apiKey = process.env.VITE_GOOGLE_BOOKS_API_KEY
            if (!apiKey || !req.url) {
              return
            }

            const url = new URL(req.url, 'http://localhost')
            if (!url.searchParams.has('key')) {
              url.searchParams.set('key', apiKey)
              proxyReq.path = `/books/v1/volumes${url.search}`
            }
          },
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
  }
}
