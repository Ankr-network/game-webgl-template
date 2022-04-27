const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url"),
      "buffer": require.resolve("buffer")
    }
  },
  output: {
    filename: 'ankr-web3-template/js/ankr-web3.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "static" },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devtool: 'inline-source-map',
};
