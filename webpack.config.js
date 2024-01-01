const path = require('path');

module.exports = {
  mode: 'development',
  entry: './frontend/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'frontend', 'dist'),
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'frontend', 'src'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
