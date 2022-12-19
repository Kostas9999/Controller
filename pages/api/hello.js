const mysql = require("mysql2/promise");
require("dotenv").config();

export default async function loginRoute(req, res) {
  //const username = validator.escape(req.body.data);

  // create the connection to database
  const connection = await mysql.createConnection({
    host: "185.38.61.93",
    user: "MGproject",
    password: "F37E28sINiKukaNegu4uzIDu3I7iXe",
    port: 3306,
    database: "groupproject",
  });

  const [rows_user] = await connection.execute(
    `INSERT INTO users (username, email, pass) VALUES (?, ?, ?);`,
    ["name", "email", "hash"]
  );
  console.log(rows_user);
  await res.status(200).json({ ok: true });
}
