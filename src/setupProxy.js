const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://openlibrary.org',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // hapus prefix /api sebelum diteruskan
      },
    })
  );
};
