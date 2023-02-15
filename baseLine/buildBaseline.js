const { client } = require("../database/connections/db_pg_connection");

module.exports = async function (UID) {
  client.query(`SET search_path TO '${UID}';`);

  let rows = client.query(
    `SELECT  AGE(collectedFrom, created) AS difference FROM baseline;`
  );

  console.log(rows);
};
