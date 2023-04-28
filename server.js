const tls = require("tls");
const fs = require("fs");
const checksum = require("checksum");

let db_Passive = require("./database/queries/passivedata");
let db_Mid = require("./database/queries/middata");
let db_Active = require("./database/queries/activedata");
let db_CreateAll = require("./database/queries/createShema");
let sendIP = require("./database/queries/sendMyiP");

let db_Baseline = require("./baseLine/buildBaseline");
let compareBaseline = require("./baseLine/compareBaseline");
let { clearBaselineBuffer } = require("./baseLine/getBaseline");
let { clearSuppressEventBuffer } = require("./events/onEvent");

let postbox = [];
let connections = [];
let PORT = 443;
//
const options = {
  ca: fs.readFileSync("./cert/ca.pem"),
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/ca.pem"),
  passphrase: "MGproject",
  rejectUnauthorized: true,
  requestCert: true,
};

setInterval(() => {
  try {
    let users = Object.keys(connections).length;

    sendIP(PORT, users);
  } catch (error) {
    console.log(error);
  }
}, 300000);

const server = tls.createServer(options, async (socket) => {
  console.log(
    "CONNECTED:",
    socket.authorized ? "authorized" : "unauthorized",
    socket.remoteAddress.slice(socket.remoteAddress.lastIndexOf(":") + 1).trim()
  );
  socket.setEncoding("utf8");
  socket.write(JSON.stringify({ type: "MSG", data: "Connected to a server" }));

  socket.on("data", (data) => {
    try {
      data = JSON.parse(data);

      let checkSumValid =
        data?.trailer?.CHECKSUM === checksum(JSON.stringify(data.data));

      if (!checkSumValid) {
        console.log("Checksum missmatch.. Following Data Is Discarded.");
        console.log(data);
        return;
      }
    } catch (error) {
      console.log(data);
      console.log(error);
    }

    // Sort data by its type

    if (data.type == "HELLO") {
      console.log("CONNECTED: " + data.UID + " TIME: " + new Date());

      connections[data.UID] = socket;

      let users = Object.keys(connections).length;
      sendIP(PORT, users);

      clearBaselineBuffer(data.UID);
      clearSuppressEventBuffer(data.UID);

      db_CreateAll(data.UID);
      setTimeout(() => {
        try {
          db_Baseline.build(data.UID);
        } catch (error) {
          console.log("Error building baseline\n" + error);
        }
      }, 60000);
      // db_Baseline.build(data.UID);

      //  db_getBaseline.get(data.UID);
    } else if (data.type == "MSG") {
      console.log(
        data.data +
          " " +
          socket.remoteAddress.substring(7) +
          " Date:t " +
          new Date()
      );
    } else if (data.type == "DATA_ACTIVE") {
      let ip = JSON.stringify(socket.remoteAddress);
      ip = socket.remoteAddress
        .slice(socket.remoteAddress.lastIndexOf(":") + 1)
        .trim();

      data.data.networkStats.publicip = ip;

      compareBaseline.active(data);
      db_Active(data);
      //  checkPostBox(data.UID, socket);
    } else if (data.type == "DATA_MID") {
      compareBaseline.mid(data);
      db_Mid(data);
    } else if (data.type == "DATA_PASSIVE") {
      compareBaseline.passive(data);
      db_Passive(data);
    } else if (data.type == "EXEC") {
      let data_str = data.data;
      let data_rc = JSON.parse(data_str);

      if (connections[data_rc.device] !== undefined) {
        let message = JSON.stringify({
          type: "EXEC",
          data: data_rc,
        });

        connections[data_rc.device].write(message);
      }

      postbox[data.data.device] = data.data;

      socket.destroy();
      socket.end();
    }

    // Discard data if not recognised
    else {
      console.log("UNKNOWN_DATA_TYPE " + socket.remoteAddress);
    }
  });

  async function checkPostBox(UID, socket) {
    if (typeof postbox[UID] !== "undefined") {
      let message = JSON.stringify({
        type: "POSTBOX",
        data: { type: "EXEC", data: postbox[UID] },
      });

      socket.write(message);
      postbox[UID] = undefined;
    }
  }

  socket.on("error", (e) => {
    console.log(`User left ${e} : ${socket.remoteAddress}`);
  });
});

server.listen(PORT, () => {
  console.log("Server started");
  sendIP(PORT, 0);
});
