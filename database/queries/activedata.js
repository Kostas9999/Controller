const pool = require("../connections/db_connection");
const promisePool = pool.module.pool.promise();

module.exports = async function (data) {
  let keys = Object.keys(data.data.netStatsData);

  key_String = keys.join(", ") + ", cpu, memory";

  values_String = JSON.stringify(Object.values(data.data.netStatsData));
  values_String = values_String.substring(1, values_String.length - 1);

  try {
    const [rows] = await promisePool.execute(
      `INSERT INTO ${data.UID}.networkstats ( ${key_String} ) VALUES (${values_String} , ${data.data.cpu} , ${data.data.memory} ) ;`
    );
  } catch (e) {
    console.log("db error active " + e);
  }
  //.catch((e) => console.log("db ERROR" + e));
  pool.module.pool.releaseConnection(promisePool);
};
