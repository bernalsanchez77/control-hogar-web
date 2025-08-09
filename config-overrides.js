module.exports = function override(config, env) {
  if (env === "production") {
    // Disable code minification
    config.optimization.minimize = false;
    // Keep readable output
    config.devtool = false; // or 'source-map' if you still want maps
  }
  return config;
};
