const { client } = require("../database/connections/db_pg_connection");

module.exports = async function (UID, gatewayMAC) {
  client.query(`SET search_path TO '${UID}';`);

  let rows = await client.query(
    `SELECT collectedfrom ,collectionperiod, created - collectedFrom AS difference FROM baseline LIMIT 1;`
  );
  let collecting_Period = rows.rows[0].collectionperiod;
  let collecting_FromDate = rows.rows[0].collectedfrom;
  let collecting_CurrentDiff = rows.rows[0].difference.days;

  console.log(rows.rows);
  if (collecting_CurrentDiff > collecting_Period) {
    console.log("Baseline is up to date");
  } else {
    console.log("Updating baseline..");

    client.query(`SET search_path TO '${UID}';`);

    let rows_netStats = await client.query(
      `SELECT 
      AVG(memory)::numeric(10) AS memavg, 
      AVG(locallatency)::numeric(10) AS locavg,
      AVG(publiclatency)::numeric(10) AS pubavg
      FROM networkstats  WHERE created >= created + interval '${0}' day AND created <=   created + interval '${collecting_Period}' day
        ;`
    );

    client.query(`SET search_path TO '${UID}';`);
    await client.query(
      `UPDATE baseline SET 
    memoryuses='${rows_netStats.rows[0].memavg}', 
    locallatency='${rows_netStats.rows[0].locavg}',
    publiclatency='${rows_netStats.rows[0].pubavg}'  
    WHERE defaultgateway= '${gatewayMAC}';`
    );
    let rows_hw = await client.query(` 
    SELECT totalmemory FROM hardware LIMIT 1
    `);

    client.query(`SET search_path TO '${UID}';`);
    await client.query(
      `UPDATE baseline SET 
    memorytotal='${rows_hw.rows[0].totalmemory}' 
    WHERE defaultgateway= '${gatewayMAC}';`
    );

    let rows_ports = await client.query(` 
    SELECT port FROM ports
    `);
    let ports_nr = [];
    rows_ports.rows.forEach((p) => {
      ports_nr.push(p.port);
    });

    await client.query(
      `UPDATE baseline SET 
      ports='${ports_nr.toString()}' 
      WHERE defaultgateway= '${gatewayMAC}';`
    );

    let rows_neighbours = await client.query(` 
    SELECT mac FROM arp
    `);
    let neighbours = [];
    rows_neighbours.rows.forEach((p) => {
      neighbours.push(p.mac);
    });
    console.log(rows_neighbours);

    await client.query(
      `UPDATE baseline SET 
      neighbours='${neighbours.toString()}' 
      WHERE defaultgateway= '${gatewayMAC}';`
    );
  }
};
//and created <=   created + interval '${collecting_Period}' day
