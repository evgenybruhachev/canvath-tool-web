const NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {};

config.context = path.join(__dirname, '/src');

config.entry = {
  app: './index.jsx',
  vendor: [
    'babel-polyfill',
    'react',
    'react-dom',
    'react-redux',
    'redux',
    './draw-tool/drawtool.js',
    './assets/js/jm-color-picker.js',
  ],
};

config.resolve = {
  extensions: ['', '.js', '.jsx'],
};

config.module = {
  loaders: [
    {
      test: /src.*\.(js|jsx$)/,
      exclude: /(node_modules|drawtool.js|jm-color-picker.js)/,
      loader: 'babel',
    },
  ],
};

config.postcss = [autoprefixer];

config.plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
  }),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(NODE_ENV),
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
    },
  }),
  new ExtractTextPlugin('[name].css'),
];


// Development

if (NODE_ENV === 'development') {
  config.output = {
    path: path.join(__dirname, '/build/'),
    filename: '[name].js',
  };

  config.module.loaders.push({
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      'style-loader',
      'css-loader?-url&sourceMap!postcss-loader!sass-loader?sourceMap'
    ),
  });

  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
  );

  config.plugins.push(
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
    ], {
      copyUnmodified: false,
    })
  );

  config.devtool = 'cheap-module-source-map';
}

// Production

if (NODE_ENV === 'production') {
  config.output = {
    path: path.join(__dirname, '/build/'),
    filename: '[name].min.js',
  };

  config.module.loaders.push({
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      'style-loader',
      'css-loader?-url&minimize!postcss-loader!sass-loader'
    ),
  });

  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js')
  );

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,  // eslint-disable-line camelcase
      },
    })
  );

  config.plugins.push(
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
    ], {
      copyUnmodified: true,
    })
  );
}

module.exports = config;
