const path = require('path');
// For our css modules these will be locally scoped
const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
  modules: true,
  localIdentName: '[name]_[local]_[hash:base64:5]',
  importLoaders: 2,
  camelCase:true,
  sourceMap: false, // turned off as causes delay
 }
}
// For our normal CSS files we would like them globally scoped
const CSSLoader = {
  loader: 'css-loader',
  options: {
  modules: "global",
  importLoaders: 2,
  camelCase:true,
  sourceMap: false, // turned off as causes delay
 }
}
// Standard style loader (prod and dev covered here)
const MiniCssExtractPlugin = require("mini-css-extract-plugin");const devMode = process.env.NODE_ENV !== 'production';
const styleLoader = devMode ? 'style-loader' : MiniCssExtractPlugin.loader;

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  devtool: 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".js", ".ts", ".tsx"]
  },
  devServer: {
    contentBase: './dist'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSLoader]
       },
       {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSModuleLoader]
       },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};
