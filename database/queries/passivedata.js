const { client } = require("../connections/db_pg_connection");

module.exports = async function (data) {
  // get keys from object passed to this function
  let keys = Object.keys(data.data);
  let conflict_Key = "created";
  // loop over each key
  keys.forEach(async (key) => {
    switch (key) {
      case "os":
        conflict_Key = "relese";
        break;
      case "hardware":
        conflict_Key = "totalMemory";
        break;
      case "networkinterface":
        conflict_Key = "mac";
        break;
      case "server":
        conflict_Key = "ip";
        break;
    }

    key_String = Object.keys(data.data[key]);
    key_String = key_String.join(",");

    values_String = JSON.stringify(Object.values(data.data[key]));
    values_String = values_String
      .substring(1, values_String.length - 1)
      .replaceAll('"', "'");

    await client.query(
      `INSERT INTO "${data.UID}"."${key}" ( ${key_String} ) 
       VALUES ( ${values_String} )  
       ON CONFLICT (${conflict_Key}) 
       DO UPDATE SET (${key_String}, created) = ( ${values_String}, now());`
    );
  });
};
