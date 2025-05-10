const { v4: uuidv4 } = require("uuid");

const utils = require("../utils");
const storage = require("../storage");
const config = require("../config");

exports.postCreateUser = async (req, res) => {
  const body = JSON.parse(await utils.readRequestBody(req));
  if (
    body.username === undefined ||
    body.age === undefined ||
    body.hobbies === undefined
  ) {
    utils.sendJson(res, 400, { message: "Bad Request" });
    return;
  }
  const storageData = await storage.get();
  let isNameTaken = false;
  for (let user in storageData.users) {
    if (storageData.users[user].username === body.username) {
      isNameTaken = true;
    }
  }
  if (isNameTaken) {
    utils.sendJson(res, 400, {
      message: `User.username='${body.username}' already exists`,
    });
    return;
  }
  const id = uuidv4();
  storageData.users[id] = {
    id: id,
    username: body.username,
    age: body.age,
    hobbies: body.hobbies,
  };
  await storage.save(storageData);
  utils.sendJson(res, 200, {
    message: `User.username='${body.username}' has been created`,
  });
};

exports.getUsers = async (req, res) => {
  const storageData = await storage.get();
  const users = storageData.users;
  if (!users) {
    utils.sendJson(res, 400, { message: "No users in database" });
    return;
  }
  utils.sendJson(res, 200, { users });
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  const { users } = await storage.get();
  const user = users[userId];
  if (!user) {
    utils.sendJson(res, 404, { message: "User doesn't exist" });
    return;
  }
  utils.sendJson(res, 200, user);
};

exports.deleteUserById = async (req, res) => {
  const storageData = await storage.get();
  const userId = req.params.userId;
  const { users } = await storage.get();
  const user = users[userId];
  delete storageData.users[userId];
  await storage.save(storageData);
  if (!user) {
    utils.sendJson(res, 404, { message: "User doesn't exist" });
    return;
  }
  utils.sendJson(res, 204);
};

exports.updateUserById = async (req, res) => {
  const body = JSON.parse(await utils.readRequestBody(req));
  const storageData = await storage.get();
  const userId = req.params.userId;
  const { users } = await storage.get();
  if (!users[userId]) {
    utils.sendJson(res, 404, { message: "User doesn't exist" });
    return;
  }
  storageData.users[userId] = { ...storageData.users[userId], ...body };
  await storage.save(storageData);
  utils.sendJson(res, 200, { [userId]: storageData.users[userId] });
};
