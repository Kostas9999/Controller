const { client } = require("../connections/db_pg_connection");
const http = require("https");

module.exports = async function (port, users) {
  try {
    const options = {
      host: "checkip.amazonaws.com",
      port: 443,
      path: "/",
    };
    http
      .get(options, function (res) {
        res.setEncoding("utf8");
        res.on("data", function (ip) {
          ip = ip.replace("\n", "").trim();

          client.query(
            ` INSERT INTO  groupproject.server (ip, port, connectedusers) VALUES ('${ip}', ${port}, ${users}) ON CONFLICT (ip,port) DO UPDATE SET (connectedusers, heartbeat)  = (${users}, now() ); `
          );
          console.log(
            `HEARTHBEAT: IP: ${ip} PORT: ${port}  CONNECTED USERS: ${users}  TIME: ${new Date()} `
          );
        });
      })
      .on("error", function (e) {
        console.log("Got error: " + e.message);
      });
  } catch (error) {
    console.log(error);
  }
};
