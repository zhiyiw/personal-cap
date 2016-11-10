"use strict"

const webpack = require("webpack")
const autoprefixer = require("autoprefixer")
const path = require("path")
const fs = require("fs")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const HOST = "localhost"
const PORT = 8000

function generateEntries(pages, entry) {
  for (let page of pages) {
    entry[page] = [
      `webpack-dev-server/client?http://${HOST}:${PORT}`,
      "webpack/hot/only-dev-server",
      `./src/${page}/index.js`
    ]
  }
}

function generateHtmls(pages, plugins) {
  for (let page of pages) {
    plugins.push(
      new HtmlWebpackPlugin({
        filename: `${page}.html`,
        template: `src/${page}/index.html`,
        inject: true,
        chunks: ["vendor", page],
      })
    )
  }
}

const options = {
  entry: {
    vendor: [
      "babel-polyfill",
      "imports?define=>false!exports?_gsScope.GreenSockGlobals!gsap/src/uncompressed/TimelineLite",
      "imports?define=>false!gsap/src/uncompressed/plugins/CSSPlugin",
      "isomorphic-fetch",
      "react",
      "react-dom",
      "react-intl",
      "react-intl/locale-data/en",
      "react-intl/locale-data/zh",
      "react-redux",
      "react-router",
      "react-router-redux",
      "reactutils",
      "redux",
      "redux-thunk",
    ],
  },
  output: {
    path: path.resolve("dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js",
    publicPath: `http://${HOST}:${PORT}/`
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: `react-hot!babel?${JSON.stringify({
          presets: ["es2015", "stage-1", "react"],
          plugins: ["transform-decorators-legacy"],
          cacheDirectory: true
        })}`,
        include: [path.resolve("src")]
      },
      {
        test: /\.less$/,
        loader: "style!css?-minimize&sourceMap!postcss!less?sourceMap",
      },
      {
        test: /\.css$/,
        loader: "style!css?-minimize&sourceMap!postcss!",
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file?name=images/[name].[ext]",
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        loader: "file?name=fonts/[name].[ext]",
      },
    ]
  },
  postcss() {
    return [autoprefixer({
      browsers: ["last 2 versions", "ie 9"]
    })]
  },
  resolve: {
    root: [
      path.resolve("src/index"),
      path.resolve("src/shared"),
      path.resolve("src"),
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "js/[name].js",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: "eval-cheap-module-source-map",
  devServer: {
    contentBase: "dist",
    hot: true,
    publicPath: "/",
    historyApiFallback: true,
    stats: {colors: true},
    host: HOST,
    port: PORT,
  },
}

const pages = fs.readdirSync("src")
  .filter(page => !["shared", "fonts", "images", ".DS_Store"].includes(page))
generateEntries(pages, options.entry)
generateHtmls(pages, options.plugins)

module.exports = options
