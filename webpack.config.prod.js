const CopyWebpackPlugin = require('copy-webpack-plugin'),
  JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  mode: 'production',
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
    ]),
    new JavaScriptObfuscator({
      compact: true,
      disableConsoleOutput: true,
    }, ['bundle.js'])
  ]
}