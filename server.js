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

// array to store connections that will be received from API call to webserver
let connections = [];

// port 443 used to bypass limitation on public network
let PORT = 443;

// Settings for secure connection
const options = {
  ca: fs.readFileSync("./cert/ca.pem"),
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/ca.pem"),
  passphrase: "MGproject",
  rejectUnauthorized: true,
  requestCert: true,
};

// Report that server is alive every 5 minutes
setInterval(() => {
  try {
    let users = Object.keys(connections).length;

    sendIP(PORT, users);
  } catch (error) {
    console.log(error);
  }
}, 300000);

// create connection
const server = tls.createServer(options, async (socket) => {
  console.log(
    "CONNECTED:",
    socket.authorized ? "authorized" : "unauthorized",
    socket.remoteAddress.slice(socket.remoteAddress.lastIndexOf(":") + 1).trim()
  );

  // set encoding
  socket.setEncoding("utf8");

  // inform user that is connected to a server (user can start sending the data)
  socket.write(JSON.stringify({ type: "MSG", data: "Connected to a server" }));

  // If data is received
  socket.on("data", (data) => {
    try {
      // parse data to an object
      data = JSON.parse(data);

      let checkSumValid =
        data?.trailer?.CHECKSUM === checksum(JSON.stringify(data.data));

      // validate checksum
      // if checksum missmatch drop the packet
      if (!checkSumValid) {
        console.log("Checksum missmatch.. Following Data Is Discarded.");
        console.log(data.data);
        return;
      }
    } catch (error) {
      console.log(data);
      console.log(error);
    }

    // Sort data by its type

    if (data.type == "HELLO") {
      console.log("CONNECTED: " + data.UID + " TIME: " + new Date());

      // add connected user to a connection list
      // list will be used to pass messages from webserver or to request data
      connections[data.UID] = socket;

      let users = Object.keys(connections).length;

      // update server report with user count (might be used from load balancing)
      sendIP(PORT, users);

      // clear buffers( cache) for particular user
      clearBaselineBuffer(data.UID);
      clearSuppressEventBuffer(data.UID);

      // create schema for new user
      // for other just verify if schema is updated (CREATE IF NOT EXISTS)
      db_CreateAll(data.UID);

      // set timeout for baseline
      // let exchange inital data before running baseline
      setTimeout(() => {
        try {
          db_Baseline.build(data.UID);
        } catch (error) {
          console.log("Error building baseline\n" + error);
        }
      }, 60000);
    }
    // Messages to be printed in console and might be used for logging
    else if (data.type == "MSG") {
      console.log(
        data.data +
          " " +
          socket.remoteAddress.substring(7) +
          " Date:t " +
          new Date()
      );
    }
    // Process active data
    else if (data.type == "DATA_ACTIVE") {
      // get ip address
      let ip = JSON.stringify(socket.remoteAddress);
      ip = socket.remoteAddress
        .slice(socket.remoteAddress.lastIndexOf(":") + 1)
        .trim();

      // add ip address to datafield
      data.data.networkStats.publicip = ip;

      // check data against baseline and trigger events if needed
      compareBaseline.active(data);

      // pass data to database query
      db_Active(data);
    } else if (data.type == "DATA_MID") {
      // check data against baseline and trigger events if needed
      compareBaseline.mid(data);
      // pass data to database query
      db_Mid(data);
    } else if (data.type == "DATA_PASSIVE") {
      // check data against baseline and trigger events if needed
      compareBaseline.passive(data);
      // pass data to database query
      db_Passive(data);
    } else if (data.type == "EXEC") {
      // prepare data to pass it to a end node
      if (connections[data.data.device] !== undefined) {
        let message = JSON.stringify({
          type: "EXEC",
          data: data.data,
        });

        // Send execution request to a node
        connections[data.data.device].write(message);
      }

      // drop connection between website and a server (dont think that works - DEBUG)
      socket.destroy();
      socket.end();
    }

    // Discard data if not recognised
    else {
      console.log("UNKNOWN_DATA_TYPE " + socket.remoteAddress);
    }
  });

  // display message when user left (TODO remove user from connection list)
  socket.on("error", (e) => {
    console.log(`User left ${e} : ${socket.remoteAddress}`);
  });
});

// start server
server.listen(PORT, () => {
  console.log("Server started");
  sendIP(PORT, 0);
});
