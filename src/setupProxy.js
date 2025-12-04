const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://control-hogar-psi.vercel.app',
      changeOrigin: true,
      secure: true,
    })
  );
  app.use(
    '/roku',
    createProxyMiddleware({
      target: 'http://192.168.86.28:8060',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/roku': '' },
    })
  );
};
