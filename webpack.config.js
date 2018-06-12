const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => {
  const proxyIndex = url.parse(options.dev ? '/assets/' : publicPath).pathname;
  return {
    entry: {
      app: './src/main.js',
      admin: './src/main_admin.js',
      vendor: './src/vendor'
    },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
      chunkFilename: '[id].js?[chunkhash]',
      publicPath: options.dev ? proxyIndex : publicPath    //这个和下面的路径一致
    },
    module: {
      rules: [{
          test: /\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }]
        }
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        chunks: ['app', 'vendor', 'manifest'],
        inject: true,      
      }),
      new HtmlWebpackPlugin({
        filename: 'admin.html',
        template: 'src/index.html',
        chunks: ['admin', 'vendor', 'manifest'],
        inject: true,
      }), 
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json', '.css']
    },
    devServer: {
      host: '127.0.0.1',
      port: 8010,
      proxy: {
        '/api/': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      },
      historyApiFallback: {
        // index: proxyIndex,  //这个我感觉没用
        rewrites: [
          { from: /^\/admin.html/, to: proxyIndex + '/admin.html' },
          { from: /^\/index.html/, to: proxyIndex + '/index.html' }
        ]
      }
    },
    devtool: options.dev ? '#eval-source-map' : '#source-map'
  }
};
