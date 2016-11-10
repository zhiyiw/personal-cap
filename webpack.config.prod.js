"use strict"

const webpack = require("webpack")
const autoprefixer = require("autoprefixer")
const path = require("path")
const fs = require("fs")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

function generateEntries(pages, entry) {
  for (let page of pages) {
    entry[page] = `./src/${page}/index.js`
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
    filename: "js/[name].[chunkhash:8].js",
    chunkFilename: "js/[name].[chunkhash:8].js",
    publicPath: ""
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: `babel?${JSON.stringify({
          presets: ["es2015", "stage-1", "react"],
          plugins: ["transform-decorators-legacy"],
          cacheDirectory: true
        })}`,
        include: [path.resolve("src")]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("css?minimize!postcss!less"),
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css?minimize!postcss"),
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file?name=images/[name].[ext]",
        include: [path.resolve("src")]
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        loader: "file?name=fonts/[name].[ext]",
        include: [path.resolve("src")]
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
    new ExtractTextPlugin(
      "css/[name].[contenthash:8].css",
      {allChunks: true}
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "js/vendor.v1.js",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
  ],
}

const pages = fs.readdirSync("src")
  .filter(page => !["shared", "fonts", "images", ".DS_Store"].includes(page))
generateEntries(pages, options.entry)
generateHtmls(pages, options.plugins)

module.exports = options
