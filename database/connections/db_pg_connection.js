const fs = require("fs");
const { Client, Pool } = require("pg");
//import { Client, Pool } from "pg";

const config = {
  connectionString:
    "postgresql://MGproject:YP4rEujgDgdEcuUUE2e6xA@cluster-4036.6zw.cockroachlabs.cloud:26257/test?sslmode=verify-full",
  // Beware! The ssl object is overwritten when parsing the connectionString
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync("../../cert/db/cockroach_db_root.crt").toString(),
  },
};

const client = new Client(config);
client.connect((err) => {
  if (err) {
    console.error("error connecting", err.stack);
  } else {
    client.query(
      `CREATE TABLE IF NOT EXISTS baseline (
        MemoryTotal bigint DEFAULT NULL,
        MemoryUses int DEFAULT NULL,
        LocalLatency int DEFAULT NULL,
        PublicLatency int DEFAULT NULL,
        defaultGateway varchar(50) DEFAULT NULL,
        Ports varchar(2555)   DEFAULT NULL,
        Collectionperiond int DEFAULT NULL,
        CollectedFrom date DEFAULT NULL,
        Created timestamp NULL DEFAULT CURRENT_TIMESTAMP
      )   ;`
    );
  }
});
