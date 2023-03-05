const { client } = require("../database/connections/db_pg_connection");

let baseLine = {};

async function getBaselineBuff(UID) {
  if (typeof baseLine[UID] !== "undefined") {
    console.log(baseLine[UID]);
    if (baseLine[`${UID}`].data == undefined) {
      updateBaselineBuff(UID);
    }

    // console.log(UID);
    return baseLine[`${UID}`];
  } else {
    await client.query(`SET search_path TO "${UID}";`);
    rows_mac = await client.query(
      `SELECT dgmac FROM "${UID}"."networkstats" LIMIT 1`
    );

    if (rows_mac.rowCount == 0) {
      return `Not enough data to update baseline for ${UID} TIME: ${new Date()}`;
    } else {
      await client.query(`SET search_path TO '${UID}';`);
      rows_baseline = await client.query(
        `SELECT * FROM "${UID}"."baseline"  where defaultgateway = '${rows_mac.rows[0].dgmac}' LIMIT 1`
      );

      return baseLine[`${UID}`];
    }
  }
}
// TODO: remove code dublication as moved to single function

async function updateBaselineBuff(UID) {
  client.query(`SET search_path TO '${UID}';`);
  rows_mac = await client.query(
    `SELECT dgmac FROM "${UID}"."networkstats" ORDER BY created DESC LIMIT 1`
  );

  if (rows_mac.rowCount == 0) {
    return `Not enough data to update baseline for ${UID} TIME: ${new Date()}`;
  } else {
    await client.query(`SET search_path TO '${UID}';`);
    rows_baseline = await client.query(
      `SELECT * FROM "${UID}"."baseline"  where defaultgateway = '${rows_mac.rows[0].dgmac}' LIMIT 1`
    );

    baseLine[`${UID}`] = {
      UID,
      data: rows_baseline.rows[0],
    };
    return baseLine[`${UID}`];
  }
}

async function clearBaselineBuffer(UID) {
  baseLine[`${UID}`] = {
    UID,
    data: undefined,
  };
}

module.exports = { getBaselineBuff, updateBaselineBuff, clearBaselineBuffer };
