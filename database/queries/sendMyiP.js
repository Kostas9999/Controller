const { client } = require("../connections/db_pg_connection");
const http = require("https");

module.exports = async function (port) {
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
            ` INSERT INTO  groupproject.server (ip,port) VALUES('${ip}', ${port}) ON CONFLICT (ip) DO UPDATE SET heartbeat = now(); `
          );
          console.log(
            `HEARTHBEAT: IP: ${ip} PORT: ${port} TIME: ${new Date()}`
          );
        });
      })
      .on("error", function (e) {
        console.log("Got error: " + e.message);
      });

    /*

      res.on("end", () => {
        const data = JSON.parse(body);
        client.query(
          ` INSERT INTO  groupproject.server (ip,port) VALUES('${data.ip}', ${port}) ON CONFLICT (ip) DO UPDATE SET heartbeat = now(); `
        );
        console.log(
          `HEARTHBEAT: IP: ${data.ip} PORT: ${port} TIME: ${new Date()}`
        );
      });
      */
  } catch (error) {
    console.log(error);
  }
};
