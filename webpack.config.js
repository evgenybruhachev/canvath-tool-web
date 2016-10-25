const NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {};

config.context = __dirname + '/src';

config.entry = {
  app: './index.js',
    vendor: [
    'react',
    'react-dom',
    'react-redux',
    'redux'
  ]
};

config.module = {
  loaders: [
    {
      test: /src.*\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }
  ]
};

config.postcss = [ autoprefixer({ browsers: ['last 3 versions'] }) ];

config.plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html'
  }),
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(NODE_ENV),
    'process.env': {
      'NODE_ENV': JSON.stringify(NODE_ENV)
    }
  }),
  new ExtractTextPlugin('[name].css')
];


// Development
if(NODE_ENV === 'development'){

  config.output = {
    path: __dirname + '/build/',
    filename: '[name].js'
  };

  config.module.loaders.push({
    test:   /\.css$/,
    loader: ExtractTextPlugin.extract(
      'style-loader',
      'css-loader?-url&sourceMap&modules&importLoaders=1&localIdentName=[local]___[hash:base64:5]!postcss-loader'
    )
  });

  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
  );

  config.plugins.push(
    new CopyWebpackPlugin([
      {from: 'assets', to: 'assets'},
    ], {
      copyUnmodified: false
    })
  );

  config.devtool = 'cheap-module-source-map';

}


//Production
if(NODE_ENV === 'production'){

  config.output = {
    path: __dirname + '/build/',
    filename: '[name].min.js'
  };

  config.module.loaders.push({
    test:   /\.css$/,
    loader: ExtractTextPlugin.extract(
      'style-loader',
      'css-loader?-url&minimize&modules&importLoaders=1&localIdentName=[hash:base64:5]!postcss-loader'
    )
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
        warnings: false
      },
      mangle: {
        screw_ie8: true  // eslint-disable-line camelcase
      }
    })
  );

  config.plugins.push(
    new CopyWebpackPlugin([
      {from: 'assets', to: 'assets'},
    ], {
      copyUnmodified: true
    })
  );

}
module.exports = config;