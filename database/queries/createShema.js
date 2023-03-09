const { client } = require("../connections/db_pg_connection");

module.exports = async function (hwuuid) {
  console.error(`DATABASE: STARTED BUILD for ${hwuuid} at TIME: ${new Date()}`);
  client.query(
    ` INSERT INTO  groupproject.device (id) VALUES('${hwuuid}') ON CONFLICT (id) DO NOTHING; `
  );

  await client.query(` CREATE schema IF NOT EXISTS "${hwuuid}";`);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."disc" (
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
  )  ;
  `);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."events" (
    event_ID serial PRIMARY KEY ,
    type varchar DEFAULT NULL,
    value varchar DEFAULT NULL,
    baseline varchar DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    );
    `);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."hardware" (
    HWUUID varchar(50)  NOT NULL DEFAULT 'none',
    Title varchar(255) DEFAULT NULL,
    TotalMemory bigint DEFAULT NULL UNIQUE,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP      
    ) ;
    `);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."networkinterface" (
    iface varchar(50) DEFAULT NULL,
    speed int DEFAULT NULL,
    mac varchar(50) DEFAULT NULL UNIQUE,
    IPv4 varchar(50) DEFAULT NULL,
    IPv4Sub varchar(50) DEFAULT NULL,
    IPv6 varchar(50) DEFAULT NULL,
    IPv6Sub varchar(50) DEFAULT NULL,   
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
  ) ;
  `);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."networkstats" (
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
    publicip varchar(50) DEFAULT NULL,
    cpu int DEFAULT NULL,
    memory int DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    )  ;
    `);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."os" (
    hostname varchar(50) DEFAULT NULL,
    version varchar(50) DEFAULT NULL,
    relese varchar(50) DEFAULT NULL UNIQUE,
    build varchar(50) DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    )  ;
    `);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."ports" (
    port int DEFAULT NULL UNIQUE,
    processName varchar(255)  DEFAULT NULL,
    PID int DEFAULT NULL,
    processPath varchar(255)   DEFAULT NULL,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
  )  ;`);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."user" (
    username varchar(50)   NOT NULL DEFAULT 'none' UNIQUE,
    loginTime varchar(50) DEFAULT NULL,     
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    ) ;`);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."arp" (
    ip varchar(50)   NOT NULL DEFAULT 'none' UNIQUE,      
    mac varchar(50) DEFAULT NULL UNIQUE,   
    type varchar(50) DEFAULT NULL,   
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    ) ;`);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."server" (
    ip varchar(50)   NOT NULL DEFAULT 'none' UNIQUE,      
    port varchar(50) DEFAULT NULL,       
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    ) ;`);

  client.query(`
    CREATE TABLE IF NOT EXISTS "${hwuuid}"."baseline" (
    memoryTotal bigint DEFAULT NULL,
    memoryUses int DEFAULT NULL,
    cpuuses int DEFAULT NULL,
    memoryuses_t BIGINT default 80,
    localLatency int DEFAULT NULL,
    localLatency_t BIGINT default 200,
    publicLatency int DEFAULT NULL,
    publicLatency_t BIGINT default 200,
    defaultGateway varchar(50) DEFAULT NULL UNIQUE,
    iface varchar DEFAULT NULL,
    speed int DEFAULT NULL,
    mac varchar(50) DEFAULT NULL,
    IPv4 varchar(50) DEFAULT NULL,
    IPv4Sub varchar(50) DEFAULT NULL,
    IPv6 varchar(50) DEFAULT NULL,
    IPv6Sub varchar(50) DEFAULT NULL,
    publicip varchar(50) DEFAULT NULL,
    ports varchar   DEFAULT 0,
    neighbours varchar  DEFAULT 0,
    Collectionperiod int DEFAULT 14 ,
    CollectedFrom timestamp DEFAULT CURRENT_TIMESTAMP,
    created timestamp NULL DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (defaultGateway)
  )   ;
  `);

  console.error(
    `DATABASE: COMPLETED BUILD for ${hwuuid} at TIME: ${new Date()}`
  );
};
