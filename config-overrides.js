module.exports = function override(config, env) {
  if (env === "production") {
    // Completely disable minification
    config.optimization.minimize = false;

    // Remove any minification plugins
    config.optimization.minimizer = [];

    // Optional: keep readable output formatting
    config.output.filename = 'static/js/[name].js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';

    // Optional: disable source maps if you want plain readable JS
    config.devtool = false;
  }
  return config;
};
