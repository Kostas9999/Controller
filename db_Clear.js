const mysql = require("mysql2");

export const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "MGproject",
  password: "F37E28sINiKukaNegu4uzIDu3I7iXe",
  port: 3306,
  database: "groupproject",
});
//mysql://b2c2ebcba0073b:9ccac70f@eu-cdbr-west-03.cleardb.net/heroku_54b7530745c0825?reconnect=true
