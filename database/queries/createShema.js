const pool = require("../connections/db_connection");
const {client} = require("../connections/db_pg_connection");


//const connection = pool.module.pool.promise();
const connection = client;

module.exports = async function (hwuuid) {

  connection.query(`CREATE TABLE IF NOT EXISTS devices (
    id varchar(255) DEFAULT NULL);`)


  connection.query(`INSERT INTO groupproject.devices (id) VALUES ( ${hwuuid} );`);

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${hwuuid};`);

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.baseline (
    MemoryTotal bigint DEFAULT NULL,
    MemoryUses int DEFAULT NULL,
    LocalLatency int DEFAULT NULL,
    PublicLatency int DEFAULT NULL,
    defaultGateway varchar(50) DEFAULT NULL,
    Ports varchar(2555)   DEFAULT NULL,
    Collectionperiond int DEFAULT NULL,
    CollectedFrom date DEFAULT NULL,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT  ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.disc (
    fs varchar(50) CHARACTER SET utf8mb4  NOT NULL DEFAULT 'none',
    type varchar(50) DEFAULT NULL,
    size bigint DEFAULT NULL,
    used bigint DEFAULT NULL,
    available bigint DEFAULT NULL,
    uses double DEFAULT NULL,
    mount varchar(50) DEFAULT NULL,
    rw tinytext,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fs)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.events (
      event_ID int NOT NULL AUTO_INCREMENT,
      Comment varchar(50) DEFAULT NULL,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (event_ID) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.hardware (
      HWUUID varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'none',
      Title varchar(255) DEFAULT NULL,
      TotalMemory bigint DEFAULT NULL,
      Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (HWUUID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.networkinterface (
    iface_id int NOT NULL AUTO_INCREMENT,
    iface varchar(50) DEFAULT NULL,
    speed int DEFAULT NULL,
    mac varchar(50) DEFAULT NULL,
    IPv4 varchar(50) DEFAULT NULL,
    IPv4Sub varchar(50) DEFAULT NULL,
    IPv6 varchar(50) DEFAULT NULL,
    IPv6Sub varchar(50) DEFAULT NULL,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (iface_id),
    UNIQUE KEY Created (Created)
  ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.networkstats (
      iface varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
      rx_total bigint DEFAULT '0',
      rx_dropped bigint DEFAULT '0',
      rx_error bigint DEFAULT '0',
      tx_total bigint DEFAULT '0',
      tx_dropped bigint DEFAULT '0',
      tx_error bigint DEFAULT '0',
      localLatency int DEFAULT '0',
      publicLatency int DEFAULT NULL,
      defaultGateway varchar(50) DEFAULT NULL,
      cpu int DEFAULT NULL,
      memory int DEFAULT NULL,
      Created timestamp NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.os (
      hostname varchar(50) DEFAULT NULL,
      version varchar(50) DEFAULT NULL,
      relese varchar(50) DEFAULT NULL,
      build varchar(50) DEFAULT NULL,
      Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY Created (Created)
    ) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.ports (
    port int DEFAULT NULL,
    processName varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
    PID int DEFAULT NULL,
    processPath varchar(255) CHARACTER SET utf8mb4  DEFAULT NULL,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY port (port)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.user (
      username varchar(50) CHARACTER SET utf8mb4  NOT NULL DEFAULT 'none',
      loginTime varchar(50) DEFAULT NULL,
      UNIQUE KEY port (username)
    ) ENGINE=InnoDB AUTO_INCREMENT=5440 DEFAULT CHARSET=utf8mb4 ;`
  );
};
