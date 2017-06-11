const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;
const sourcePath = path.join(__dirname, './app');
const buildDirectory = path.join(__dirname, './build');

const stats = {
    assets: true,
    children: false,
    chunks: false,
    hash: false,
    modules: false,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true,
    colors: {
        green: '\u001b[32m'
    }
};

module.exports = function(env) {
    const nodeEnv = env && env.prod ? 'production' : 'development';
    const isProd = nodeEnv === 'production';

    let cssLoader;

    const plugins = [
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify(nodeEnv)}
        }),

        new ExtractTextPlugin('style-[contenthash:8].css'),

        new HtmlWebpackPlugin({
            template: './index.ejs',
            inject: true,
            production: isProd,
            minify: isProd && {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        })
    ];

    if (isProd) {
        cssLoader = ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        module: true, // css-loader 0.14.5 compatible
                        modules: true,
                        localIdentName: '[hash:base64:5]'
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        outputStyle: 'collapsed',
                        sourceMap: true,
                        includePaths: [sourcePath]
                    }
                }
            ]
        });
    } else {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        );

        cssLoader = [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[local]'
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    outputStyle: 'expanded',
                    sourceMap: false,
                    includePaths: [sourcePath]
                }
            }
        ];
    }

    const entryPoint = isProd
        ? ['babel-polyfill', './index.jsx']
        : [
            'babel-polyfill',
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://${host}:${port}`,
            'webpack/hot/only-dev-server',
            './index.jsx'
        ];

    return {
        devtool: isProd ? 'source-map' : 'cheap-module-source-map',
        context: sourcePath,
        entry: {
            main: entryPoint
        },
        output: {
            path: buildDirectory,
            publicPath: '/',
            filename: '[name]-[hash:8].js',
            chunkFilename: '[name]-[chunkhash:8].js'
        },
        module: {
            rules: [
                {
                    test: /\.(html|svg|jpe?g|png|ttf|woff2?)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'static/[name]-[hash:8].[ext]'
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: cssLoader
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
            modules: [path.resolve(__dirname, 'node_modules'), sourcePath]
        },

        plugins,

        performance: isProd && {
            maxAssetSize: 300000,
            maxEntrypointSize: 300000,
            hints: 'warning'
        },

        stats: stats,

        devServer: {
            contentBase: './app',
            publicPath: '/',
            historyApiFallback: true,
            port: port,
            host: host,
            hot: !isProd,
            compress: isProd,
            stats: stats
        }
    };
};