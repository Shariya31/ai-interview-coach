import { createProxyMiddleware } from "http-proxy-middleware";

const interviewProxy = createProxyMiddleware({
  target: "http://interview-service:6000",
  changeOrigin: true,
  // pathRewrite: {
  //   "^/interviews": "",
  // },
  context: ["/interviews"],
});

export default interviewProxy;
