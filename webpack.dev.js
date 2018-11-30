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
        dashboard: './src/pages/student/dashboard.js',
        dashboard: './src/pages/professor/dashboard.js',
        survey: './src/pages/survey/survey.js',
        results:'./src/pages/results/results.js'
    },
    output: {
        publicPath: '/'
    },
    devServer: {
        port: 5000,
        contentBase: path.join(__dirname, "dist"),
        proxy: {
            "/.netlify": {
            target: "http://localhost:9000",
            pathRewrite: { "^/.netlify/functions": "" }
            }
        }
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
                loader: 'babel-loader'
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
            template: './src/pages/about/about.html',
            inject: true,
            chunks: ['about'],
            filename: './about/index.html' 
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/student/dashboard.html',
            inject: true,
            chunks: ['dashboard'],
            filename: './student/dashboard/index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/professor/dashboard.html',
            inject: true,
            chunks: ['dashboard'],
            filename: './professor/dashboard/index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/survey/survey.html',
            inject: true,
            chunks: ['survey'],
            filename: './survey/index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/results/results.html',
            inject: true,
            chunks: ['results'],
            filename: './results/index.html'
        }),
    ]
};
