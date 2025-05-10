require("dotenv").config();

module.exports = {
  port: +process.env.PORT || 8080,
  storageFileName: process.env.STORAGE_FILE_NAME || ".data.json",
};
