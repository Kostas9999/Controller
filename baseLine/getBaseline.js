const { client } = require("../database/connections/db_pg_connection");
const buldBaseline = require("./buildBaseline");

let baseLine = {};

UID = "e368b009_dc92_11e5_9c43_bc00000c0000"; /// temp !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
gatewayMAC = " 78-24-af-87-bd-34";
get(UID, gatewayMAC);

async function get(UID, gatewayMAC) {
  client.query(`SET search_path TO '${UID}';`);
  const rows = await client.query(
    `SELECT * FROM baseline WHERE defaultgateway = '${gatewayMAC}' LIMIT 1;`
  );

  // if there is entry
  // check if is collected from full period
  //if yes return values
  //if no send update request and return values
  //// if no etries for this gateway mac create new entry

  if (rows.rowCount > 0) {
    if (typeof baseLine[`${UID}`] === "undefined") {
      baseLine[`${UID}`] = { data: rows.rows };
    }
    //  buldBaseline(UID);
  } else {
    client.query(
      `INSERT INTO "baseline" (defaultgateway, CollectedFrom) VALUES ( '${gatewayMAC}' , CURRENT_TIMESTAMP ) `
    );
    console.log(`Created new baseline for: ${UID} with gateway: ${gatewayMAC}`);
  }
}

module.exports = { get, baseLine };
