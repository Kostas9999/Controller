const { client } = require("../database/connections/db_pg_connection");

async function build(UID) {
  let mac;
  

  await client.query(`SET search_path TO '${UID}';`);
  rows_mac = await client.query(`SELECT dgmac FROM networkstats LIMIT 1`);

  if (rows_mac.rows == 0) {
    console.log(
      `Not enough data to update baseline for ${UID} TIME: ${new Date()}`
    );
  } else {
    mac = rows_mac.rows[0].dgmac;
    client.query(`
      INSERT INTO baseline (defaultgateway) VALUES ( '${mac}' )  
      ON CONFLICT DO NOTHING`);

    let rows = await client.query(`
                              SELECT collectedfrom ,collectionperiod, created - collectedFrom AS difference 
                              FROM baseline LIMIT 1;
                              `);
    let collecting_Period = rows.rows[0].collectionperiod;
    let collecting_FromDate = rows.rows[0].collectedfrom;
    let collecting_CurrentDiff = rows.rows[0].difference.days;

    if (collecting_CurrentDiff > collecting_Period) {
      console.log("Baseline is up to date");
    } else {
      console.log(`Updating baseline for ${UID} TIME: ${new Date()}`);

      client.query(`SET search_path TO '${UID}';`);
      let rows_netStats = await client.query(`
        SELECT 
        AVG(memory)::numeric(10) AS memavg, 
        AVG(locallatency)::numeric(10) AS locavg,
        AVG(publiclatency)::numeric(10) AS pubavg
        FROM networkstats  WHERE created >= created + interval '${0}' day 
        AND created <=   created + interval '${collecting_Period}' day
        ;
        `);

      await client.query(`SET search_path TO '${UID}';`);
      client.query(`
          UPDATE baseline SET 
          memoryuses='${rows_netStats.rows[0].memavg}', 
          locallatency='${rows_netStats.rows[0].locavg}',
          publiclatency='${rows_netStats.rows[0].pubavg}'  
          WHERE defaultgateway= '${mac}';`);
      let rows_hw = await client.query(` 
          SELECT totalmemory FROM hardware LIMIT 1
    `);

      client.query(`SET search_path TO '${UID}';`);
      client.query(`
        UPDATE baseline SET 
        memorytotal='${rows_hw.rows[0].totalmemory}' 
        WHERE defaultgateway= '${mac}';
    `);

      let rows_ports = await client.query(`SELECT port FROM ports`);
      let ports_nr = [];
      rows_ports.rows.forEach((p) => {
        ports_nr.push(p.port);
      });

      client.query(`
        UPDATE baseline SET 
        ports='${ports_nr.toString()}' 
        WHERE defaultgateway= '${mac}';`);

      let rows_neighbours = await client.query(`SELECT mac FROM arp`);
      let neighbours = [];
      rows_neighbours.rows.forEach((p) => {
        neighbours.push(p.mac);
      });

      client.query(`
        UPDATE baseline SET 
        neighbours='${neighbours.toString()}' 
        WHERE defaultgateway= '${mac}';`);
    }
    console.log(
      `Updating baseline for ${UID} completed at TIME: ${new Date()}`
    );
  }
}
module.exports = { build };
