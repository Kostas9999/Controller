const mysql = require("mysql2/promise");
require("dotenv").config();

export default async function loginRoute(req, res) {
  //const username = validator.escape(req.body.data);

  // create the connection to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  });

  const [rows_user] = await connection.execute(
    `INSERT INTO users (username, email, pass) VALUES (?, ?, ?);`,
    ["name", "email", "hash"]
  );
  console.log(rows_user);
  await res.status(200).json({ ok: true });
}
