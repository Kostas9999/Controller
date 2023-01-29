import { connection } from "../connections/db_connection";

const device = function (hwuuid) {
  connection.query(`INSERT INTO devices (id) VALUES ( ? );`, [hwuuid]);

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

module.exports = {
  device,
  remove,
};
