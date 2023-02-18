const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "185.38.61.93",
  user: "MGproject",
  password: "F37E28sINiKukaNegu4uzIDu3I7iXe",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

exports.module = { pool };
