const { client } = require("../database/connections/db_pg_connection");




async function build(UID) {
  let mac;

  rows_mac = await client.query(
    `SELECT dgmac FROM "${UID}"."networkstats" ORDER BY created DESC LIMIT 1`
  );

  if (rows_mac.rows == 0) {
    console.log(
      `Not enough data to update baseline for ${UID} TIME: ${new Date()}`
    );
  } else {
    mac = rows_mac.rows[0].dgmac.trim();

    // await client.query(`SET search_path TO '${UID}';`);
    await client.query(`
      INSERT INTO "${UID}"."baseline" (defaultgateway) VALUES ( '${mac}' )  
      ON CONFLICT DO NOTHING;`);
    // await client.query(`SET search_path TO '${UID}';`);
    let rows = await client.query(`
                              SELECT collectedfrom ,collectionperiod, created - collectedFrom AS difference 
                              FROM "${UID}"."baseline" WHERE defaultgateway ILIKE '${mac}' LIMIT 1;
                              `);

    let collecting_Period = rows.rows[0].collectionperiod;
    let collecting_FromDate = rows.rows[0].collectedfrom;
    let collecting_CurrentDiff = rows.rows[0].difference.days;

    if (collecting_CurrentDiff > collecting_Period) {
      console.log("Baseline is up to date");
    } else {
      console.log(`Updating baseline for ${UID} TIME: ${new Date()}`);
      // await client.query(`SET search_path TO '${UID}';`);

      let rows_netStats = await client.query(`
        SELECT 
        AVG(memory)::numeric(10) AS memavg, 
        AVG(cpu)::numeric(10) AS cpuavg, 
        AVG(locallatency)::numeric(10) AS locavg,
        AVG(publiclatency)::numeric(10) AS pubavg
        FROM "${UID}"."networkstats"  WHERE created >= 
        (SELECT collectedfrom FROM "${UID}"."baseline" WHERE defaultgateway ILIKE '${mac}' LIMIT 1)
        + interval '${0}' day 
        AND created <= 
        (SELECT collectedfrom FROM "${UID}"."baseline" WHERE defaultgateway ILIKE '${mac}' LIMIT 1)
          + interval '${collecting_Period}' day
        ;`);

      //  await client.query(`SET search_path TO '${UID}';`);
      await client.query(`
          UPDATE "${UID}"."baseline" SET 
          memoryuses='${rows_netStats.rows[0].memavg}', 
          cpuuses='${rows_netStats.rows[0].cpuavg}', 
          locallatency='${rows_netStats.rows[0].locavg}',
          publiclatency='${rows_netStats.rows[0].pubavg}'  
          WHERE defaultgateway ILIKE '${mac}' ;`);
      let rows_hw = await client.query(` 
          SELECT totalmemory FROM  "${UID}"."hardware" LIMIT 1
    `);

      // await client.query(`SET search_path TO '${UID}';`);
      await client.query(`
        UPDATE "${UID}"."baseline" SET 
        memorytotal='${rows_hw.rows[0].totalmemory}' 
        WHERE defaultgateway= '${mac}';
    `);

      let ports_base = await client.query(
        `SELECT ports FROM "${UID}"."baseline" WHERE defaultgateway= trim('${mac}') `
      );

      let ports_nr_str = ports_base.rows[0].ports;
      let rows_ports = await client.query(`SELECT port FROM "${UID}"."ports"`);

      rows_ports.rows.forEach((p) => {
        if (!("," + ports_nr_str + ",").includes("," + p.port + ",")) {
          console.log(`${p.port} - Port added to baseline`);
          ports_nr_str = ports_nr_str + "," + p.port;
        }
      });

      await client.query(`
        UPDATE "${UID}"."baseline" SET 
        ports='${ports_nr_str}' 
        WHERE defaultgateway= '${mac}';`);
      //=============================

      let neigh_base = await client.query(
        `SELECT neighbours FROM "${UID}"."baseline" WHERE defaultgateway= '${mac}' `
      );

      let neigh_base_str = neigh_base.rows[0].neighbours;
      let rows_neigh = await client.query(`SELECT mac FROM "${UID}"."arp"`);

      rows_neigh.rows.forEach((p) => {
        if (!("," + neigh_base_str + ",").includes("," + p.mac + ",")) {
          console.log(`${p.port} - Port added to baseline`);
          neigh_base_str = neigh_base_str + "," + p.mac;
        }
      });

      await client.query(`
          UPDATE "${UID}"."baseline" SET 
          neighbours='${neigh_base_str}' 
          WHERE defaultgateway= '${mac}';`);
    }

    let iface = await client.query(
      `SELECT iface, COUNT(*) as frequency
    FROM "${UID}"."networkstats"
    GROUP BY iface
    ORDER BY frequency DESC
    LIMIT 1`
    );

    let iface_all = await client.query(
      `SELECT *  FROM "${UID}"."networkinterface" WHERE iface = '${iface.rows[0].iface.trim()}'  ORDER BY created DESC
      LIMIT 1`
    );

    await client.query(`
    UPDATE "${UID}"."baseline" SET 
    ( speed, mac, ipv4,ipv4sub,ipv6,ipv6sub,publicip) 
    =
    ('${iface_all.rows[0].speed}','${iface_all.rows[0].mac}','${iface_all.rows[0].ipv4}',      
      '${iface_all.rows[0].ipv4sub}','${iface_all.rows[0].ipv6}','${iface_all.rows[0].ipv4sub}','${iface_all.rows[0].publicip}') 
    WHERE defaultgateway= '${mac}';`);

    await client.query(`
    UPDATE "${UID}"."baseline" SET 
    iface ='${iface.rows[0].iface}' 
    WHERE defaultgateway= '${mac}';`);

    console.log(
      `Updating baseline for ${UID} completed at TIME: ${new Date()}`
    );
  }
}
module.exports = { build };
