const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  // let target = 'https://preview.pro.ant.design';

  // 代理目标地址
  // 这里使用 backend 主要用于区分 vercel serverless 的 api 路径
  // if (req.url.startsWith('/backend')) {
  // target = 'https://preview.pro.ant.design';
  // }

  // 创建代理对象并转发请求
  createProxyMiddleware('/api/', {
    target: 'https://preview.pro.ant.design',
    changeOrigin: true,
    pathRewrite: {
      '^': '',
    },
  })(req, res);
};
