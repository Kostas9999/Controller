const { client } = require("../database/connections/db_pg_connection");

let baseLine = {};

async function getBaselineBuff(UID) {
  
  if (baseLine[UID]?.data === undefined) {
    updateBaselineBuff(UID);
  
    baseLine[UID] = {UID:UID};
  }
  return baseLine[UID];
}

async function updateBaselineBuff(UID) {
  rows_mac = await client.query(
    `SELECT dgmac FROM "${UID}"."networkstats" ORDER BY created DESC LIMIT 1`
  );
  
let mac;
  if (rows_mac.rowCount == 0 ) {
    return `Not enough data to update baseline for ${UID} TIME: ${new Date()}`;
  } else {
   mac = rows_mac.rows[0].dgmac;

    rows_baseline = await client.query(
      `SELECT * FROM "${UID}"."baseline" WHERE "defaultgateway" ILIKE trim('${mac}') LIMIT 1;`
    );

    baseLine[UID] = {
      UID,
      data: rows_baseline.rows[0],
    };
    return baseLine[UID];
  }
}

async function clearBaselineBuffer(UID) {
  baseLine[`${UID}`] = {
    UID,
    data: undefined,
  };
}

module.exports = { getBaselineBuff, updateBaselineBuff, clearBaselineBuffer };
