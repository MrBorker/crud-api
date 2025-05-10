const cluster = require("node:cluster");
const os = require("os");
const server = require("./index");

const PORT = Number(process.env.PORT || 4000);
const PARALLELISM = os.availableParallelism() - 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  require("./balancer");

  for (let i = 0; i < PARALLELISM; i++) {
    const workerPort = PORT + 1 + i;
    cluster.fork({ WORKER_PORT: workerPort });
  }
} else {
  const port = Number(process.env.WORKER_PORT);
  server.listen(port, () => {
    console.log(`Worker ${process.pid} started on port ${port}`);
  });
}
