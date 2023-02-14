//const pool = require("../connections/db_connection");
const { client } = require("../connections/db_pg_connection");
//const promisePool = client;

//const promisePool = pool.module.pool.promise();

module.exports = async function (data) {
  let keys = Object.keys(data.data);

  let ports_keys = Object.keys(data.data.ports[0]);
  ports_keys = ports_keys.join(", ");

  let disc_keys = Object.keys(data.data.disc[0]);
  disc_keys = disc_keys.join(", ");

  let user_keys = Object.keys(data.data.user);
  user_keys = user_keys.join(", ");

  keys.forEach(async (key) => {
    if (key === "ports") {
      data.data.ports.forEach(async (key) => {
        values_String = JSON.stringify(Object.values(key));
        values_String = values_String
          .substring(1, values_String.length - 1)
          .replaceAll('"', "' ");

        try {
          client.query(`SET search_path TO '${data.UID}';`);     

          client.query(
            `INSERT INTO "ports" ( ${ports_keys}  ) VALUES (${values_String})  ON CONFLICT (port) DO UPDATE SET created = now();`
          );

        } catch (error) {
          console.log(error);
        }
      });
    }

    if (key === "disc") {
      data.data.disc.forEach(async (disc) => {
        values_String = JSON.stringify(Object.values(disc));
        values_String = values_String
          .substring(1, values_String.length - 1)
          .replaceAll('"', "' ");
        try {
          client.query(`SET search_path TO '${data.UID}';`);
          await client.query(
    

            `INSERT INTO "disc" ( fs, type, size, used, available, uses, mount, rw  ) VALUES (${values_String})  ON CONFLICT (fs) DO UPDATE SET created = now();`
          );
        } catch (error) {
          console.log(" " + error);
        }
      });
    }
    if (key === "user") {
      values_String = JSON.stringify(Object.values(data.data.user));
      values_String = values_String
        .substring(1, values_String.length - 1)
        .replaceAll('"', "' ");
      try {
        console.log(values_String)
        client.query(`SET search_path TO '${data.UID}';`);
        await client.query(
          //`REPLACE INTO ${data.UID}.${key} ( ${user_keys} ) VALUES (${values_String} );`
          `INSERT INTO "${key}" ( ${user_keys} ) VALUES (${values_String})  ON CONFLICT (username) DO UPDATE SET created = now();`
        );
      } catch (error) {
        console.log(" " + error);
      }
    }
  });
};
