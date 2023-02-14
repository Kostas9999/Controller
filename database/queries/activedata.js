const pool = require("../connections/db_connection");
const { client } = require("../connections/db_pg_connection");

const promisePool = client;
//const promisePool = pool.module.pool.promise();

module.exports = async function (data) {
  let keys = Object.keys(data.data.networkStats);

  key_String = keys.join(", ") + ", cpu, memory";

  values_String = Object.values(data.data.networkStats);

  // values_String = values_String.substring(0 , values_String.length - 1);
  //console.log(values_String);
  client.query(`SET search_path TO '${data.UID}';`);
  try {
    await promisePool.query(
      `INSERT INTO "networkstats" ( ${key_String} ) VALUES (
        '${values_String[0]}',
        ${values_String[1]},
        ${values_String[2]},
        ${values_String[3]},
        ${values_String[4]},
        ${values_String[5]},
        ${values_String[6]},
        ${values_String[7]},
        ${values_String[8]},
        '${values_String[9]}',
        '${values_String[10]}'

        
        , '${data.data.cpu}' , '${data.data.memory}' ) ;`
    );
  } catch (e) {
    console.log(e);
  }
};
