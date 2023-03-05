const pool = require("../connections/db_connection");
const { client } = require("../connections/db_pg_connection");

//const promisePool = client;
//const promisePool = pool.module.pool.promise();

module.exports = async function (data) {
  let keys = Object.keys(data.data.networkStats);

  key_String = keys.join(", ") + ", cpu, memory";

  values_String = JSON.stringify(Object.values(data.data.networkStats)).trim();

  values_String = values_String
    .substring(1, values_String.length - 1)
    .replaceAll('"', "' ");
  //console.log(values_String);
  client.query(`SET search_path TO '${data.UID}';`);

  await client.query(
    `INSERT INTO "${data.UID}"."networkstats" ( ${key_String} ) VALUES ( ${values_String}, '${data.data.cpu}' , '${data.data.memory}');`
  );
};
