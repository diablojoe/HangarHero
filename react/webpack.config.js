var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [
        "react-hot-loader/patch",
        "webpack-dev-server/client?http://0.0.0.0:3000",
        "webpack/hot/only-dev-server",
        "babel-polyfill",
        "whatwg-fetch",
        "./src/index"
    ],
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, "dist"),
        port: 3000,
        host: "0.0.0.0",
        publicPath: "/",
        historyApiFallback: true,
        disableHostCheck: true
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: "app.[hash].js"
    },
    devtool: "eval",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["es2015", {"modules": false}],
                        "stage-0",
                        "react"
                    ],
                    plugins: [
                        "transform-async-to-generator",
                        "transform-decorators-legacy"
                    ]
                }
            },
            {
                test: /\.scss|css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "resolve-url-loader",
                    "sass-loader?sourceMap"
                ]
            },
            {
                   test: /\.(gif|png|jpe?g|svg)$/i,
   use: [
      'file-loader', {
        loader: 'image-webpack-loader',
        options: {
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 7,
          },
          pngquant: {
            quality: '65-90',
            speed: 4
          },
          mozjpeg: {
            progressive: true,
            quality: 65
          },
          // Specifying webp here will create a WEBP version of your JPG/PNG images
          webp: {
            quality: 75
          }
        }
      }
    ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "file-loader"
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ hash: false, template: "./index.hbs" }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
    ]
};
