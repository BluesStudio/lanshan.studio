/* webpack.config.js
 * @ Cong Min
 */
var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: ['./src/js/app.js'],
        lib: ['./src/js/lib.js']
    },
    output: {
        path: './static',
        filename: '[name].js?[chunkhash:8]',
        publicPath: "static/"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            filename: 'lib.js?[chunkhash:8]',
            chunks: ['app', 'lib']
        }),
        new HtmlPlugin({
            template: './src/index.html',
            filename: '../index.html',
            chunks: ['app', 'lib'],
            inject: 'body'
        }),
        new ExtractTextPlugin('[name].css?[contenthash:8]'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.html$/, loader: 'html'
        },  {
            test: /\.scss$/, loader: ExtractTextPlugin.extract(['css', 'sass'], { publicPath:'./' }), exclude: /node_modules/
        },  {
            test: /\.css$/, loader: ExtractTextPlugin.extract(['css'], { publicPath:'./' })
        },  {
            test: /\.(png|gif)$/, loaders: [ 'file?limit=8192&name=img/[name].[ext]?[hash:8]', 'image-webpack' ]
        },  {
            test: /\.(jpe?g)$/, loaders: [ 'file?limit=8192&name=img/[name].[ext]?[hash:8]' ]
        },  {
            test: /\.(eot|woff|woff2|ttf|svg)$/, loader: 'url', query: { limit: 8192, prefix: 'font/', name: 'font/[name].[ext]?[hash:8]' }
        }],
        resolve: {
            extensions: ['', '.js']
        }
    }
};