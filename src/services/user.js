const crypto = require("crypto");
const configs = require("../configs");
module.exports = (db) => {
  return {
    async getUserByUserName(username) {
      return await this.getProfile(username, 1);
    },

    /*
      type: 1 = 用户名 0 = id
    */
    async getProfile(value, type = 0) {
      let sql = "";
      let preparedValues = [];
      let where = "";

      if (type === 0) {
        where = " where `id`=?";
      } else {
        where = " where `username`=?";
      }
      sql =
        "select `id`,`username`,`password`,`avatar`,`created_at` as `createAt` ,`last_logined_at` as `lastLoginedAt` from `users`" +
        where;
      preparedValues = [value];
      let [[user]] = await db.query(sql, preparedValues);
      return user;
    },

    async addUser(username, password) {
      const hmac = crypto.createHmac("sha256", configs.user.passwordSalt);
      password = hmac.update(password).digest("hex");
      const createdAt = Date.now();

      let sql = "";
      let preparedValues = [];
      sql =
        "insert into `users`(`username`,`password`,`created_at`,`last_logined_at`) values (?,?,?,?)";
      preparedValues = [username, password, createdAt, 0];

      let [{ insertId }] = await db.query(sql, preparedValues);
      return {
        id: insertId,
      };
    },
  };
};
