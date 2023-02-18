const { client } = require("../database/connections/db_pg_connection");

async function solveEmail(receiver) {
  rows = await client.query(`SELECT email, "user"."emailpref"
    FROM "groupproject"."user" JOIN "groupproject"."device"  ON "user"."user_ID" = "device"."user" WHERE ("device"."id" = 
    '${receiver}')  LIMIT  1; `);
  if (rows.rowCount > 0) {
    return rows.rows[0];
  } else {
    return { email: "none", emailpref: "none" };
  }
}

module.exports = { solveEmail };
