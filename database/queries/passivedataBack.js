const { client } = require("../connections/db_pg_connection");

module.exports = async function (data) {
  // get keys from object passed to this function
  let keys = Object.keys(data.data);

  // loop over each key
  keys.forEach(async (key) => {
    // get most reacent entry in database to compare
    // Reason is that: for passive data only changes are recorded such as OS update

    let rows = await client.query(
      `SELECT * FROM "${data.UID}"."${key}" ORDER BY Created DESC LIMIT 1;`
    );

    // check is there was any entries in database
    // delete field "Created" as it will differ from data that is collected and what is in database
    // it could trigger new entry even field data is the same
    if (rows.length > 0) delete rows[0].Created;

    // check is data the same
    // do nothing if the same, used for debuging
    // else - if data is different add data to database
    if (JSON.stringify(data.data[key]) === JSON.stringify(rows[0])) {
      // console.log(`Passive data is the same (${key})`);
    } else {
      // strigify keys for dynamic query
      // MUST use .join(", ") for keys and .stringify for values
      key_String = Object.keys(data.data[key]);
      key_String = key_String.join(",");

      values_String = JSON.stringify(Object.values(data.data[key]));
      values_String = values_String
        .substring(1, values_String.length - 1)
        .replaceAll('"', "'");

      // db query
      // insert into "device id" as database, "key" for current table, stringifyed keys and values /// TODO: PREPARED STATAMENTS

      await client.query(
        `INSERT INTO "${data.UID}"."${key}" ( ${key_String} ) VALUES ( ${values_String} )  ON CONFLICT DO NOTHING;`
      );
    }
  });
};
