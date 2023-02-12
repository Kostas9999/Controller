const pool = require("../database/connections/db_connection");
const promisePool = pool.module.pool.promise();

let baseLine = [];

async function get(UID) {
  //  UID = "4c4c4544_0033_4c10_8037_c7c04f4d3633"; /// temp !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const [rows] = await promisePool.execute(
    `SELECT * FROM ${UID}.baseline ORDER BY Created ASC LIMIT 1;`
  );

 
  baseLine.push({
    UID: UID,
    data: rows[0],
  });
}



module.exports = { get, baseLine };
