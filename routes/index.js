const health = require("./health");
const users = require("./users");

module.exports = {
  "/health": {
    GET: health.getHealth,
  },
  "/api/users": {
    POST: users.postCreateUser,
    GET: users.getUsers,
  },
  "/api/users/{userId}": {
    GET: users.getUserById,
    PUT: users.updateUserById,
    DELETE: users.deleteUserById,
  },
};
