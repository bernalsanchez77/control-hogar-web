const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function override(config, env) {
  // --- DEBUG LOGGING ---
  console.log(`[Config Overrides] Current environment is: ${env}`);
  // --- END DEBUG LOGGING ---

  // --- PRODUCTION BUILD OVERRIDES (Your Existing Logic) ---
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
  
  // --- DEVELOPMENT SERVER PROXY CONFIGURATION (NEW LOGIC) ---
  if (env === 'development') {
    // This defines the proxy logic for the 'npm start' command
    config.devServer = {
      ...config.devServer,
      proxy: {
        // 1. Rule for Vercel API access
        '/api/vercel': {
          target: 'https://control-hogar-psi.vercel.app',
          secure: true, 
          changeOrigin: true,
          logLevel: 'debug',
          pathRewrite: {
            '^/api/vercel': '/api', 
          },
        },
        // 2. Rule for Roku Device (private IP)
        '/query': {
          target: 'http://192.168.86.28:8060',
          secure: false, 
          changeOrigin: true,
          logLevel: 'debug',
        },
      },
    };
  }

  return config;
};