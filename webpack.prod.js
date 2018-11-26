const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'source-map',
    entry: {
        home: './src/index.js',
        dashboard: './src/pages/dashboard/dashboard.js',
        register: './src/pages/register/register.js'
    },
    output: {
        filename: '[name].[hash:20].js',
        publicPath: "/",
        path: buildPath
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [ {
                loader: 'html-loader',
                options: {
                    interpolate: true,
                    minimize: true,
                    removeComments: true,
                    collapseWhitespace: true
                }
            }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(scss|css|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            // translates CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // Runs compiled CSS through postcss for vendor prefixing
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            // compiles Sass to CSS
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'expanded',
                                sourceMap: true,
                                sourceMapContents: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                }),
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'image/svg+xml',
                        name: 'assets/[name].[ext]'
                    }
                    }
                ]
            },
            {
            test: /\.(jpe?g|png|gif|ico)$/i,
            use: [
                {
                loader: 'file-loader',
                options: {
                    name: 'assets/[name].[ext]'
                }
                }
            ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true,
            chunks: ['home'],
            filename: './index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/register/register.html',
            inject: true,
            chunks: ['register'],
            filename: './register/index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/about/about.html',
            inject: true,
            chunks: ['about'],
            filename: './about/index.html'
        }),
        new HtmlWebpackPlugin({
            template: './admin/index.html',
            inject: true,
            chunks: ['index'],
            filename: './admin/index.html' //not sure if i'm adding the admin page correctly
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/dashboard/dashboard.html',
            inject: true,
            chunks: ['dashboard'],
            filename: './dashboard/index.html'
        }),
        new CleanWebpackPlugin(buildPath),
        new FaviconsWebpackPlugin({
            // Your source logo
            logo: './src/assets/logo_transparent.png',
            // The prefix for all image files (might be a folder or a name)
            prefix: 'icons-[hash]/',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            inject: true,
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            background: '#fff',
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
            title: 'InSiight',

            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new ExtractTextPlugin('styles.[md5:contenthash:hex:20].css', {
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    ]
};
