import { createProxyMiddleware } from "http-proxy-middleware";

const authProxy = createProxyMiddleware({
  target: "http://auth-service:5000",
  changeOrigin: true,
  pathRewrite: {
    "^/auth": "",
  },
});

export default authProxy;
