const mysql = require("mysql2");

const pool = mysql.createPool({
 //  host: "185.38.61.93",
  host: "127.0.0.1",
  user: "root",
  password: "root",
  port: 3306,
  // database: "groupproject",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

exports.module = { pool };
