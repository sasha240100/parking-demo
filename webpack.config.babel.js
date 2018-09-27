import path from 'path';
import webpack from 'webpack';

export default {
  entry: './src/index.js',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /.js$/,
        include: /three\/examples/,
        use: 'imports-loader?THREE=three'
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, './public/bundle/'),
    filename: 'index.bundle.js'
  },

  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three'
    })
  ],

  devServer: {
    publicPath: '/bundle/',
    contentBase: './public/'
  }
}
