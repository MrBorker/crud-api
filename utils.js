exports.sendJson = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

exports.readRequestBody = (req) =>
  new Promise((resolve) => {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk;
    });
    req.on("end", () => resolve(buffer));
  });
