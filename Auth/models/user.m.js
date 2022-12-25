const db = require("../db/config");

module.exports = {
  getByID: async ({ id }) => {
    const res = await db.query(
      `
    SELECT * FROM "Users"
    WHERE "UserID" = $1
    `,
      [id],
    );

    return res[0];
  },
  getByUsername: async ({ username }) => {
    const res = await db.query(
      `
    SELECT * FROM "Users"
    WHERE "Username" = $1
    `,
      [username],
    );

    return res[0];
  },
  add: async ({ username, password, fullname, token, address }) => {
    const maxID = await db.query(`
    SELECT "UserID" FROM "Users" 
    ORDER BY "UserID"
    LIMIT 1
    `);

    const res = await db.query(
      `
    INSERT INTO "Users" ("UserID","Username","Password","FullName","Token","Address") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `,
      [maxID + 1, username, password, fullname, token, address],
    );

    return res;
  },
  updateToken: async ({ userID, refreshToken }) => {
    const res = await db.query(
      `UPDATE "Users" 
      SET "Token" = $2
      WHERE "UserID" = $1`,
      [userID, refreshToken],
    );

    return res;
  },
};
