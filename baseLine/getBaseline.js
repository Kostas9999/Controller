const pool = require("../database/connections/db_connection");
const promisePool = pool.module.pool.promise();

module.exports = async function (UID) {
    
    UID = "4c4c4544_0033_4c10_8037_c7c04f4d3633";


    const [rows] = await promisePool.execute(
        `SELECT * FROM ${UID}.baseline ORDER BY Created DESC LIMIT 1;`
      );

      return { 
        UID: UID,
       data : rows[0]
        
    
    } ;
      
}