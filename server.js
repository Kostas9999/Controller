const tls = require("tls");
const fs = require("fs");

let db_Passive = require("./database/queries/passivedata");
let db_Mid = require("./database/queries/middata");
let db_Active = require("./database/queries/activedata");
let db_CreateAll = require("./database/queries/createShema");

let db_Baseline = require("./baseLine/buildBaseline");
let compareBaseline = require("./baseLine/compareBaseline");

let postbox = [
  //{ task: "EXEC", msg: "ping 8.8.8.8", ID: 1 },
  // { type: "GET", msg: "PASSIVEDATA", ID: 2 },
  // { type: "EXEC", msg: "taskkill /PID 11012 /F", ID: 3 },
];
//

const options = {
  ca: fs.readFileSync("./cert/ca.pem"),
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/ca.pem"),
  passphrase: "MGproject",
  rejectUnauthorized: false,
  requestCert: true,
};

const server = tls.createServer(options, async (socket) => {
  console.log(
    "Server connected",
    socket.authorized ? "authorized" : "unauthorized"
  );
  socket.setEncoding("utf8");
  socket.write(JSON.stringify({ type: "MSG", data: "Connected to a server" }));

  socket.on("data", (data) => {
    // do validation here ///////////////////////////////////////////////////////////////
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.log(error);
    }

    // Sort data by its type

    if (data.type == "HELLO") {
      console.log("Connected: " + data.UID + " Date: " + new Date());
      db_CreateAll(data.UID).then(() => {
        db_Baseline.build(data.UID);
      });

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
      compareBaseline.active(data);
      db_Active(data);

      
    } else if (data.type == "DATA_MID") {
      db_Mid(data);
      compareBaseline.mid(data);
    } else if (data.type == "DATA_PASSIVE") {
      compareBaseline.passive(data);
      db_Passive(data);
    }

    // Discard data if not recognised
    else {
      console.log("UNKNOWN_DATA_TYPE");
    }

    // check for messages to send back to a user   !!!!!  TODO:   impliment QUEUE - FIFO not a stack
    if (postbox.length > 0) {
      socket.write(JSON.stringify({ type: "POSTBOX", data: postbox.pop() }));
    }
  });

  socket.on("error", (e) => {
    console.log("User left " + e);
  });
  // use it to log data or errors !!!!  TODO: decide loging

  // const fileStream = fs.createWriteStream("./receivedData.txt");
  // socket.pipe(fileStream);
});

server.listen(57070, () => {
  console.log("Server started");
});
