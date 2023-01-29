const connection = require("../connections/db_connection");

const promisePool = connection.module.connection.promise();

module.exports = async function (data) {
  let keys = Object.keys(data.data);

  keys.forEach(async (key) => {
    const [rows] = await promisePool.execute(
      `SELECT * FROM ${data.UID}.${key} ORDER BY Created DESC LIMIT 1;`
    );
    if (rows.length > 0) delete rows[0].Created;

    if (JSON.stringify(data.data[key]) === JSON.stringify(rows[0])) {
      // console.log(`Passive data is the same (${key})`);
    } else {
      key_String = Object.keys(data.data[key]);
      key_String = key_String.join(", ");

      values_String = JSON.stringify(Object.values(data.data[key]));
      values_String = values_String.substring(1, values_String.length - 1);

      const [rows] = await promisePool.execute(
        `INSERT INTO ${data.UID}.${key} ( ${key_String} ) VALUES (${values_String}) ;`
      );
    }
  });
};
/*
    connection.module.connection.execute(
      `SELECT * FROM ${data.UID}.${key};`
      
      
      
      ,

      function (err, rows) {
        if (err) {
          console.log("err: " + err);
        } else {
          console.log("Rows: " + JSON.stringify(rows));
        }
      }
    );
    
  */

// hwuuid = (HWUUID).replaceAll("-","_")
