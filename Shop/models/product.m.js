const db = require("../db/config");

module.exports = {
  list: async () => {
    const res = await db.query(
      `
    SELECT * FROM "Products" p
    JOIN "Categories" c ON c."CategoryID" = p."CategoryID"
    `,
    );

    return res;
  },
  listByCat: async ({ catID }) => {
    const res = await db.query(
      `
    SELECT * FROM "Products" p
    JOIN "Categories" c ON c."CategoryID" = p."CategoryID"
    WHERE p."CategoryID" = $1`,
      [catID],
    );

    return res;
  },
  listCat: async () => {
    const res = await db.query(
      `
      SELECT * FROM "Categories"
      `,
    );

    return res;
  },
};
