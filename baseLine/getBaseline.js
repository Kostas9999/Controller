const { client } = require("../database/connections/db_pg_connection");

let baseLine = {};

async function getBaselineBuff(UID) {
  if (typeof baseLine[`${UID}`] !== "undefined") {
    return baseLine[`${UID}`];
  } else {
    client.query(`SET search_path TO '${UID}';`);
    rows_mac = await client.query(`SELECT dgmac FROM networkstats LIMIT 1`);

    if (rows_mac.rowCount == 0) {
      return `Not enough data to update baseline for ${UID} TIME: ${new Date()}`;
    } else {
      await client.query(`SET search_path TO '${UID}';`);
      rows_baseline = await client.query(
        `SELECT * FROM baseline  where defaultgateway = '${rows_mac.rows[0].dgmac}' LIMIT 1`
      );

      baseLine[`${UID}`] = {
        UID,
        data: rows_baseline.rows[0],
      };
      return baseLine[`${UID}`];
    }
  }
}

async function updateBaselineBuff(UID) {
  client.query(`SET search_path TO '${UID}';`);
  rows_mac = await client.query(`SELECT dgmac FROM networkstats LIMIT 1`);

  if (rows_mac.rowCount == 0) {
    return `Not enough data to update baseline for ${UID} TIME: ${new Date()}`;
  } else {
    await client.query(`SET search_path TO '${UID}';`);
    rows_baseline = await client.query(
      `SELECT * FROM baseline  where defaultgateway = '${rows_mac.rows[0].dgmac}' LIMIT 1`
    );

    baseLine[`${UID}`] = {
      UID,
      data: rows_baseline.rows[0],
    };
    return baseLine[`${UID}`];
  }
}

module.exports = { getBaselineBuff, updateBaselineBuff };
