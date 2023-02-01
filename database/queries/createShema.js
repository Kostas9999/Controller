const pool = require("../connections/db_connection");
const connection = pool.module.pool.promise();

module.exports = async function (hwuuid) {
  connection.query(`INSERT INTO groupproject.devices (id) VALUES ( ? );`, [
    hwuuid,
  ]);

  let [data, data1, data3] = await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${hwuuid};`
  );
  console.log(data);
  console.log(data1);
  console.log(data3);

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.baseline (
    MemoryTotal bigint DEFAULT NULL,
    MemoryUses int DEFAULT NULL,
    LocalLatency int DEFAULT NULL,
    PublicLatency int DEFAULT NULL,
    defaultGateway varchar(50) DEFAULT NULL,
    Ports varchar(2555) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    Collectionperiond int DEFAULT NULL,
    CollectedFrom date DEFAULT NULL,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.disc (
    fs varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'none',
    type varchar(50) DEFAULT NULL,
    size bigint DEFAULT NULL,
    used bigint DEFAULT NULL,
    available bigint DEFAULT NULL,
    uses double DEFAULT NULL,
    mount varchar(50) DEFAULT NULL,
    rw tinytext,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fs)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.events (
      event_ID int NOT NULL AUTO_INCREMENT,
      Comment varchar(50) DEFAULT NULL,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (event_ID) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.hardware (
      HWUUID varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'none',
      Title varchar(255) DEFAULT NULL,
      TotalMemory bigint DEFAULT NULL,
      Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (HWUUID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
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
  ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.networkstats (
      iface varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.os (
      os_ID int NOT NULL AUTO_INCREMENT,
      hostname varchar(50) DEFAULT NULL,
      version varchar(50) DEFAULT NULL,
      relese varchar(50) DEFAULT NULL,
      build varchar(50) DEFAULT NULL,
      Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (os_ID),
      UNIQUE KEY Created (Created)
    ) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.ports (
    port int DEFAULT NULL,
    processName varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    PID int DEFAULT NULL,
    processPath varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY port (port)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.user (
      user_ID int NOT NULL AUTO_INCREMENT,
      username varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'none',
      loginTime varchar(50) DEFAULT NULL,
      PRIMARY KEY (user_ID)
    ) ENGINE=InnoDB AUTO_INCREMENT=5440 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  // module.exports = { device };
};
/*
  connection.query(
    `CREATE TABLE ${hwuuid}.hardware (
            id varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'none',
            Title varchar(255) DEFAULT NULL,
            TotalMemory varchar(50) DEFAULT NULL,
            Created timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id) USING BTREE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; `
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.networkinterface (
        Created timestamp UNIQUE DEFAULT CURRENT_TIMESTAMP,
        iface varchar(50) DEFAULT NULL,
        speed varchar(50) DEFAULT NULL,
        mac varchar(50) DEFAULT NULL,
        IPv4 varchar(50) DEFAULT NULL,
        IPv4Sub varchar(50) DEFAULT NULL,
        IPv6 varchar(50) DEFAULT NULL,
        IPv6Sub varchar(50) DEFAULT NULL,
        id varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'none',
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.os (
        id varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'none',
        hostname varchar(50) DEFAULT NULL,
        version varchar(50) DEFAULT NULL,
        relese varchar(50) DEFAULT NULL,
        build varchar(50) DEFAULT NULL,
        Created timestamp UNIQUE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS  ${hwuuid}.networkstats (
        Created timestamp UNIQUE DEFAULT CURRENT_TIMESTAMP,       
        interface varchar(50) DEFAULT NULL,        
        rx_total bigint DEFAULT NULL,
        rx_dropped bigint DEFAULT NULL,
        rx_error bigint DEFAULT NULL,
        tx_total bigint DEFAULT NULL,
        tx_dropped bigint DEFAULT NULL,
        tx_error bigint DEFAULT NULL,
        localLatency int DEFAULT NULL,
        publicLatency int DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  connection.query(
    `CREATE TABLE IF NOT EXISTS ${hwuuid}.ports (
        Created timestamp DEFAULT CURRENT_TIMESTAMP,   
        port int DEFAULT NULL,
        process varchar(50) DEFAULT NULL,
        pid int DEFAULT NULL,
        path varchar(254) DEFAULT NULL,
        UNIQUE KEY port (port)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
  );

  console.log(`Table created for ${hwuuid} device `);
};

const remove = function (x) {
  console.log("remove not implemented");
};




*/
