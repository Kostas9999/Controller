const fs = require("fs");
const { Client, Pool } = require("pg");
//import { Client, Pool } from "pg";

const config = {
  connectionString:
    "postgresql://MGproject:YP4rEujgDgdEcuUUE2e6xA@cluster-4036.6zw.cockroachlabs.cloud:26257/groupproject?sslmode=verify-full",
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync("./cert/db/cockroach_db_root.crt").toString(),
  },
};
let client;
let t;
getConnected();
async function getConnected() {
  client = new Client(config);
  client.connect((err) => {
    if (err) {
      clearTimeout(t);
      console.error("error connecting to database (cockroach_db) ", err.stack);
      t = setTimeout(getConnected, 3000);
    } else {
      clearTimeout(t);
    }
  });
}

module.exports = { client };
