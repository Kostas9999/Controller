const { client } = require("../database/connections/db_pg_connection");

let baseLine = {};

async function getBaselineBuff(UID) {
  if (typeof baseLine[`${UID}`] !== "undefined") {
    console.log(baseLine[`${UID}`]);
    console.log(UID);
    return baseLine[`${UID}`];
  } else {
    let data = await updateBaselineBuff(UID);
    return data;
  }
}

async function updateBaselineBuff(UID) {
  await client.query(`SET search_path TO '${UID}';`);
  rows_mac = await client.query(`SELECT dgmac FROM networkstats LIMIT 1`);

  if (
    typeof rows_mac.rows[0] === "undefined" ||
    typeof rows_mac.rows[0].dgmac === "undefined"
  ) {
    return `Not enough data to update baseline for ${UID} TIME: ${new Date()}`;
  } else {
    await client.query(`SET search_path TO '${UID}';`);
    try {
      rows_mac = await client.query(
        `SELECT * FROM baseline  where defaultgateway = '${rows_mac.rows[0].dgmac}' LIMIT 1`
      );

      baseLine[`${UID}`] = rows_mac.rows[0];
      return rows_mac.rows[0];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { getBaselineBuff, updateBaselineBuff };
