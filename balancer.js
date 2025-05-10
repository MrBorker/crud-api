const http = require("http");

const PORT = Number(process.env.PORT || 4000);
const PARALLELISM = require("os").availableParallelism() - 2;
let current = 0;

const server = http.createServer((req, res) => {
  const targetPort = PORT + 1 + (current % PARALLELISM);
  const proxy = http.request(
    {
      hostname: "localhost",
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  req.pipe(proxy, { end: true });
  proxy.on("error", (err) => {
    res.writeHead(500);
    res.end("Balancer error: " + err.message);
  });

  current++;
});

server.listen(PORT, () => {
  console.log(`Load balancer started on http://localhost:${PORT}`);
});
