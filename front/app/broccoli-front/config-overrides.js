const path = require('path');

module.exports = {
  webpack: function(config, env) {
    config.resolve = {
      ...config.resolve,
      alias: {
        '@src': path.resolve(__dirname, 'src'),
      },
    };
    return config;
  },
};