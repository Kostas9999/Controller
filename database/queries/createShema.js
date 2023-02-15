const { client } = require("../connections/db_pg_connection");

module.exports = async function (hwuuid) {
  //  connection.query(
  //   ` INSERT INTO  groupproject.devices (id) VALUES(' ${hwuuid}'); `
  // );

  await connection.query(` CREATE schema IF NOT EXISTS "${hwuuid}";`);

  client.query(`SET search_path TO '${hwuuid}';`);

  connection.query(
    `CREATE TABLE IF NOT EXISTS "disc" (
    fs varchar(50)   NOT NULL DEFAULT 'none',
    type varchar(50) DEFAULT NULL,
    size bigint DEFAULT NULL,
    used bigint DEFAULT NULL,
    available bigint DEFAULT NULL,
    uses DOUBLE PRECISION DEFAULT NULL,
    mount varchar(50) DEFAULT NULL,
    rw varchar,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fs)
  )  ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "events" (
      event_ID int NOT NULL ,
      Comment varchar(50) DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (event_ID) 
    )  ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "hardware" (
      HWUUID varchar(50)  NOT NULL DEFAULT 'none',
      Title varchar(255) DEFAULT NULL,
      TotalMemory bigint DEFAULT NULL,
      created timestamp NULL DEFAULT CURRENT_TIMESTAMP
      
    ) ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "networkinterface" (
    iface varchar(50) DEFAULT NULL,
    speed int DEFAULT NULL,
    mac varchar(50) DEFAULT NULL,
    IPv4 varchar(50) DEFAULT NULL,
    IPv4Sub varchar(50) DEFAULT NULL,
    IPv6 varchar(50) DEFAULT NULL,
    IPv6Sub varchar(50) DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    
    
  ) ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "networkstats" (
      iface varchar(50)  DEFAULT NULL,
      rx_total bigint DEFAULT '0',
      rx_dropped bigint DEFAULT '0',
      rx_error bigint DEFAULT '0',
      tx_total bigint DEFAULT '0',
      tx_dropped bigint DEFAULT '0',
      tx_error bigint DEFAULT '0',
      localLatency int DEFAULT '0',
      publicLatency int DEFAULT NULL,
      defaultGateway varchar(50) DEFAULT NULL,
      dgmac varchar(50)  DEFAULT NULL,
      cpu int DEFAULT NULL,
      memory int DEFAULT NULL,
      created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    )  ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "os" (
      hostname varchar(50) DEFAULT NULL,
      version varchar(50) DEFAULT NULL,
      relese varchar(50) DEFAULT NULL,
      build varchar(50) DEFAULT NULL,
      created timestamp NULL DEFAULT CURRENT_TIMESTAMP UNIQUE      
    )  ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "ports" (
    port int DEFAULT NULL UNIQUE,
    processName varchar(255)  DEFAULT NULL,
    PID int DEFAULT NULL,
    processPath varchar(255)   DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
  )  ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "user" (
      username varchar(50)   NOT NULL DEFAULT 'none' UNIQUE,
      loginTime varchar(50) DEFAULT NULL,     
      created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    ) ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "arp" (
      ip varchar(50)   NOT NULL DEFAULT 'none' UNIQUE,      
      mac varchar(50) DEFAULT NULL UNIQUE,   
      type varchar(50) DEFAULT NULL,   
      created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    ) ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS "baseline" (
    memoryTotal bigint DEFAULT NULL,
    memoryUses int DEFAULT NULL,
    memoryuses_t BIGINT default 80,
    localLatency int DEFAULT NULL,
    localLatency_t BIGINT default 200,
    publicLatency int DEFAULT NULL,
    publicLatency_t BIGINT default 200,
    defaultGateway varchar(50) DEFAULT NULL ,
    ports varchar   DEFAULT NULL,
    neighbours varchar  DEFAULT NULL,
    Collectionperiod int DEFAULT 14 ,
    CollectedFrom timestamp DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (defaultGateway)
  )   ;`
  );
};
