module.exports = {
  entry: {
    js: "./client/index.js",
    html: "./client/index.html",
  },  
  output: {
    path: __dirname + "/out",
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
    ],
  },
};
