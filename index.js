const { validate } = require("uuid");

const http = require("node:http");
const url = require("node:url");

const config = require("./config");
const utils = require("./utils");
const routes = require("./routes");

const matchRoute = (pathname, method) => {
  for (const routePath in routes) {
    const methodHandlers = routes[routePath];
    if (!methodHandlers[method]) continue;

    const routeParts = routePath.split("/").filter(Boolean);
    const urlParts = pathname.split("/").filter(Boolean);

    if (routeParts.length !== urlParts.length) continue;

    const params = {};

    const matched = routeParts.every((part, index) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        const paramName = part.slice(1, -1);
        params[paramName] = urlParts[index];
        return true;
      }
      return part === urlParts[index];
    });

    if (matched) {
      return { handler: methodHandlers[method], params };
    }
  }

  return null;
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const match = matchRoute(parsedUrl.pathname, req.method);

    if (match?.params?.userId && !validate(match?.params?.userId)) {
      utils.sendJson(res, 400, { message: "User id should be uuid" });
      return;
    }

    if (!match) {
      utils.sendJson(res, 404, { message: "Not Found" });
      return;
    }

    if (match?.params) req.params = match.params;

    await match.handler(req, res, parsedUrl);
  } catch (e) {
    console.log(e);
    utils.sendJson(res, 500, { message: "Internal Server Error" });
  }
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(`Server has been started on port ${config.port}`);
  });
}

module.exports = server;
