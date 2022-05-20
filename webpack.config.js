const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

const config = {
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
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devtool: 'inline-source-map',
};

var template2019Config = Object.assign({}, config, {
  output: {
    filename: 'ankr-web3-template-2019/js/ankr-web3.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "static/ankr-web3-template-2019", to: "ankr-web3-template-2019" },
      ],
    })
  ]
});
var template2020Config = Object.assign({}, config,{
  output: {
    filename: 'ankr-web3-template-2020/js/ankr-web3.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "static/ankr-web3-template-2020", to: "ankr-web3-template-2020" },
      ],
    })
  ],
});
var library = Object.assign({}, config,{
  output: {
    filename: 'lib/ankr-web3.js',
    path: path.resolve(__dirname, 'dist'),
  },
});

module.exports = [
  template2019Config,
  template2020Config,
  library
];
