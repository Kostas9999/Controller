const { client } = require("../database/connections/db_pg_connection");

async function build(UID) {
  let mac = await getMac(UID);
  if (mac !== "false") {
    await addMac(UID, mac);
    if (isStillCollecting(UID, mac)) {
      console.log(`BASELINE: STARTED UPDATE for ${UID} at TIME: ${new Date()}`);
      await setAverages(UID, mac);
      await setTotalMemory(UID, mac);
      let ports_nr_str = await getPortsFromBaseline(UID, mac);
      await updatePortBaseline(UID, mac, ports_nr_str);
      let neigh_base_str = await getNeighboursBaseline(UID, mac);
      await addNeighbours(UID, mac, neigh_base_str);
      let iface = await getMostUsed_Iface(UID);
      let iface_Data = await getIfaceData(UID, iface);
      await addInterfaceDataToBaseline(UID, mac, iface_Data);
      let publicIP = await getMostUsed_publicIP(UID);
      await addPublicIPToBaseline(UID, mac, publicIP);

      console.log(
        `BASELINE: COMPLETED UPDATE for ${UID} at TIME: ${new Date()}`
      );
    }
  } else {
    console.log("Default gateway MAC missing");
  }
}

async function addPort(UID, portToAdd) {
  let mac = await getMac(UID);
  if (isStillCollecting(UID, mac)) {
    console.log("Adding port: " + portToAdd + ": " + UID);

    let ports_nr_str = await getPortsFromBaseline(UID, mac);
    ports_nr_str = ports_nr_str + "," + portToAdd;

    await client.query(`
  UPDATE "${UID}"."baseline" SET 
  ports='${ports_nr_str}' 
  WHERE defaultgateway= '${mac}';`);
  } else {
    console.log("Baseline is already build");
  }
}

async function getMac(UID) {
  rows_mac = await client.query(
    `SELECT dgmac FROM "${UID}"."networkstats" ORDER BY created DESC LIMIT 1`
  );

  if (rows_mac.rows == 0) {
    console.log(
      `Not enough data to update baseline for ${UID} TIME: ${new Date()}`
    );
    return (mac = "false");
  } else {
    mac = rows_mac.rows[0].dgmac.trim();
    return mac;
  }
}

function addMac(UID, mac) {
  client.query(`
  INSERT INTO "${UID}"."baseline" (defaultgateway) VALUES ( '${mac}' )  
  ON CONFLICT DO NOTHING;`);
}

async function isStillCollecting(UID, mac) {
  let rows = await client.query(`
  SELECT collectedfrom, collectionperiod, created - collectedFrom AS difference 
  FROM "${UID}"."baseline" WHERE defaultgateway ILIKE '${mac}' LIMIT 1;
  `);

  let collecting_Period = rows.rows[0].collectionperiod;
  let collecting_FromDate = rows.rows[0].collectedfrom;
  let collecting_CurrentDiff = rows.rows[0].difference.days;

  if (collecting_CurrentDiff > collecting_Period) {
    return false;
  } else {
    return true;
  }
}

async function setAverages(UID, mac) {
  let baselineDates = await client.query(`
  SELECT collectedfrom ,collectionperiod, created - collectedFrom AS difference 
  FROM "${UID}"."baseline" WHERE defaultgateway ILIKE '${mac}' LIMIT 1;
  `);

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
  + interval '${baselineDates.rows[0].collectionperiod} ' day
  ;`);

  //  await client.query(`SET search_path TO '${UID}';`);
  await client.query(`
    UPDATE "${UID}"."baseline" SET 
    memoryuses='${rows_netStats.rows[0].memavg}', 
    cpuuses='${rows_netStats.rows[0].cpuavg}', 
    locallatency='${rows_netStats.rows[0].locavg}',
    publiclatency='${rows_netStats.rows[0].pubavg}'  
    WHERE defaultgateway ILIKE '${mac}' ;`);
}

async function setTotalMemory(UID, mac) {
  let rows_hw = await client.query(` 
          SELECT totalmemory FROM  "${UID}"."hardware" LIMIT 1
    `);

  await client.query(`
        UPDATE "${UID}"."baseline" SET 
        memorytotal='${rows_hw.rows[0].totalmemory}' 
        WHERE defaultgateway= '${mac}';
    `);
}

async function getPortsFromBaseline(UID, mac) {
  let ports_base = await client.query(
    `SELECT ports FROM "${UID}"."baseline" WHERE defaultgateway= trim('${mac}') `
  );

  return ports_base.rows[0].ports;
}

async function updatePortBaseline(UID, mac, ports_nr_str) {
  let rows_ports = await client.query(`SELECT port FROM "${UID}"."ports"`);

  rows_ports.rows.forEach((p) => {
    if (!("," + ports_nr_str + ",").includes("," + p.port + ",")) {
      console.log(`${p.port} - Port added to baseline : ${UID}`);
      ports_nr_str = ports_nr_str + "," + p.port;
    }
  });

  await client.query(`
      UPDATE "${UID}"."baseline" SET 
      ports='${ports_nr_str}' 
      WHERE defaultgateway= '${mac}';`);
}

async function getNeighboursBaseline(UID, mac) {
  let neigh_base = await client.query(
    `SELECT neighbours FROM "${UID}"."baseline" WHERE defaultgateway= '${mac}' `
  );
  return neigh_base.rows[0].neighbours;
}

async function addNeighbours(UID, mac, neigh_base_str) {
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
async function getMostUsed_Iface(UID) {
  let iface = await client.query(
    `SELECT iface, COUNT(*) as frequency
      FROM "${UID}"."networkstats"
      GROUP BY iface
      ORDER BY frequency DESC
      LIMIT 1`
  );

  return iface.rows[0].iface.trim();
}

async function getMostUsed_publicIP(UID) {
  let iface = await client.query(
    `SELECT publicip, COUNT(*) as frequency
      FROM "${UID}"."networkstats"
      GROUP BY publicip
      ORDER BY frequency DESC
      LIMIT 1`
  );

  return iface.rows[0].publicip.trim();
}

async function addPublicIPToBaseline(UID, mac, publicip) {
  await client.query(`
    UPDATE "${UID}"."baseline" SET 
    publicip = '${publicip}'
    WHERE defaultgateway= '${mac}';`);
}

async function getIfaceData(UID, iface) {
  let iface_all = await client.query(
    `SELECT *  FROM "${UID}"."networkinterface" WHERE iface = '${iface}'  ORDER BY created DESC
      LIMIT 1`
  );
  return iface_all.rows[0];
}

async function addInterfaceDataToBaseline(UID, mac, iface_Data) {
  await client.query(`
    UPDATE "${UID}"."baseline" SET 
    ( iface, speed, mac, ipv4,ipv4sub,ipv6,ipv6sub,publicip) 
    =
    ('${iface_Data.iface}','${iface_Data.speed}','${iface_Data.mac}','${iface_Data.ipv4}',      
      '${iface_Data.ipv4sub}','${iface_Data.ipv6}','${iface_Data.ipv4sub}','${iface_Data.publicip}') 
    WHERE defaultgateway= '${mac}';`);
}

module.exports = { build, addPort };
