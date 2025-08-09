module.exports = function override(config, env) {
  if (env === 'production') {
    config.optimization.minimize = false; // turn off minification
  }
  return config;
};
