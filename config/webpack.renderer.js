const path = require('path');
const merge = require('webpack-merge');
const webpackRenderer = require('electron-webpack/webpack.renderer.config.js');
const { extend, find, flow, has } = require('lodash');

const isProd = process.env.NODE_ENV === 'production';

function replaceLoader(config, test, callback) {
  const rule = find(config.module.rules, (r) => String(r.test) === String(test));

  if (rule) {
    extend(rule, callback(rule));
  }

  return config;
}

// Since we want to uses SCSS modules, we need to replace the
// default SCSS loader config that ships with electron-webpack.
function replaceSassLoader(config) {
  return replaceLoader(config, /\.scss/, () => ({
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: !isProd,
          minimize: isProd,
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
      {
        loader: 'sass-loader',
        options: {
          data: '@import "common/stylesheets/variables"; @import "common/stylesheets/mixins";',
          includePaths: [path.resolve(__dirname, '..', './src')],
          sourceMap: !isProd
        }
      }
    ]
  }));
}

function replaceSvgLoader(config) {
  const updatedConfig = replaceLoader(config, /\.(png|jpe?g|gif|svg)(\?.*)?$/, () => ({
    test: /\.(png|jpe?g|gif)(\?.*)?$/
  }));

  return merge.smart({}, updatedConfig, {
    module: {
      rules: [{
        test: /\.(svg)$/,
        loader: 'svg-react-loader'
      }]
    }
  });
}

function replaceUglifyPlugin(config) {
  const uglify = find(config.plugins, (plugin) => plugin.constructor.name === 'UglifyJsPlugin');

  // Don't inline single-use functions.  Prevents `TypeError: Assignment to constant variable`.
  // REF: https://github.com/mishoo/UglifyJS2/issues/2842
  if (has(uglify, 'options.uglifyOptions.compress')) {
    uglify.options.uglifyOptions.compress.inline = 1;
  }

  return config;
}

module.exports = async (env) => {
  const config = await webpackRenderer(env);

  return flow(
    replaceSassLoader,
    replaceSvgLoader,
    replaceUglifyPlugin
  )(config);
};
