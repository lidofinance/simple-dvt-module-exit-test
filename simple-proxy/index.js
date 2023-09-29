const express = require("express");
const httpProxy = require("http-proxy");
const response = require("./mock_validator.json");

const app = express();
const proxy = httpProxy.createProxyServer({});

app.get(
  [
    `/eth/v1/beacon/states/head/validators/${response.data.index}`,
    `/eth/v1/beacon/states/head/validators/${response.data.validator.pubkey}`,
  ],
  (req, res) => {
    console.log("handling request", req.originalUrl);
    res.json(response);
  }
);

app.post("/eth/v1/beacon/pool/voluntary_exits", (req, res) => {
  console.log("handling request", req.originalUrl);
  res.json({ data: { message: "success" } });
});

app.all("*", (req, res) => {
  console.log("handling request", req.originalUrl);

  proxy.web(req, res, {
    target: process.env.CL_NODE_URL,
    changeOrigin: true,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
