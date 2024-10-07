import { merge } from 'webpack-merge';
import webpackCommon from './webpack.common.js';

export default merge(webpackCommon, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './src',
  },
});
