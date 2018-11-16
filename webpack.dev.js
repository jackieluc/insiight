const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const fs = require('fs')

// // Store .html file names in src/ in an array
// const pages =
//   fs
//     .readdirSync(path.resolve(__dirname, 'src/pages'))
//     .filter(fileName => fileName.endsWith('.html'))

module.exports = {
    devtool: 'eval-cheap-module-source-map',
    entry: {
        home: './src/index.js',
        register: './src/pages/register/register.js'
    },
    devServer: {
        port: 5000,
        contentBase: path.join(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [ {
                loader: 'html-loader',
                options: {
                    interpolate: true
                }
            }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        // creates style nodes from JS strings
                        loader: "style-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // translates CSS into CommonJS
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // compiles Sass to CSS
                        loader: "sass-loader",
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    }
                    // Please note we are not running postcss here
                ]
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
        ],
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
            template: './admin/admin.html',
            inject: true,
            chunks: ['admin'],
            filename: 'admin.html'
        }),
    ]
};
