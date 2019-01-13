const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/index.html', to: 'index.html' },
    ])
  ]
}