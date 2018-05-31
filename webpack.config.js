import path from 'path'
import {
  EnvironmentPlugin,
  BannerPlugin
} from 'webpack'

export default [{
  mode: process.env.NODE_ENV,
  target: 'node',
  entry: path.resolve('src/index.js'),
  output: {
    path: path.resolve('lib'),
    filename: `migrator.js`,
    library: 'Migrator',
    libraryTarget: 'commonjs2'
  },
  node: false,
  module: {
    rules: [{
      test: /.js$/,
      use: 'babel-loader'
    }]
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: false,
      DEBUG: false
    })
  ],
  externals: [
    'pg',
    '@rabbitcc/logger'
  ]
},{
  mode: process.env.NODE_ENV,
  target: 'node',
  entry: path.resolve('src/cli.js'),
  output: {
    path: path.resolve('bin'),
    filename: `cli.js`,
    libraryTarget: 'commonjs2'
  },
  node: false,
  module: {
    rules: [{
      test: /.js$/,
      use: 'babel-loader'
    }]
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: false,
      DEBUG: false
    }),
    new BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true
    })
  ],
  externals: [
    'yargs',
    '@rabbitcc/logger',
    'get-stdin',
    'js-yaml',
    'glob',
    '../lib/migrator'
  ]
}]
