const tls = require("tls");
const fs = require("fs");
const { exec } = require("child_process");

let postbox = [
  { type: "EXEC", msg: "ping 8.8.8.8", ID: 1 },
  { type: "GET", msg: "PASSIVEDATA", ID: 2 },
  { type: "EXEC", msg: "taskkill /PID 11012 /F", ID: 3 },
];

const options = {
  ca: fs.readFileSync("./cert/ca.pem"),
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/ca.pem"),
  passphrase: "MGproject",
  rejectUnauthorized: false,
  requestCert: true,
};

const server = tls.createServer(options, (socket) => {
  console.log(
    "server connected",
    socket.authorized ? "authorized" : "unauthorized"
  );
  socket.write(JSON.stringify({ type: "MSG", data: "Connected to server" }));
  socket.setEncoding("utf8");

  socket.on("data", (data) => {
    if (data.type == "MSG") {
      console.log(data + " " + socket.remoteAddress.substring(7));
    } else {
      data = JSON.parse(data);

      if (Object.keys(data)[0] == "DATA_ACTIVE") {
        console.log("active");
      }
      if (Object.keys(data)[0] == "DATA_MID") {
        console.log("mid");
      }
      if (Object.keys(data)[0] == "DATA_PASSIVE") {
        console.log("passive");
      }
      if (Object.keys(data)[0] == "type") {
        if (data.type == "MSG") {
          console.log(data.data);
        }
      }
    }

    //console.log(data + " " + socket.remoteAddress.substring(7));

    if (postbox.length > 0) {
      socket.write(JSON.stringify({ type: "POSTBOX", data: postbox.pop() }));
    }
  });

  socket.on("error", (e) => {
    console.log(e);
  });
  // const fileStream = fs.createWriteStream("./receivedData.txt");
  // socket.pipe(fileStream);
});

server.listen(57070, () => {
  console.log("Server started");
});

/*const dgram = require("dgram");
const net = require("net");

const TCP_socket = net.createServer();
const UDP_socket = dgram.createSocket("udp4");

UDP_socket.on("message", (msg, user) => {
  console.log("\n\r" + msg + "\n\r");
});

TCP_socket.on("connection", function (sock) {
  console.log("CONNECTED: " + sock.remoteAddress + " Time " + Date.now());

  sock.on("data", function (data) {
    console.log("" + data);
  });

  sock.on("close", function () {
    console.log("closed " + sock.remoteAddress);
  });
});
UDP_socket.bind(57070);
TCP_socket.listen(57070);

*/

/*

CLIENT
const tls = require('tls');
const fs = require('fs');

const options = {
  ca: [fs.readFileSync('path/to/ca_cert.pem')],
  checkServerIdentity: function(host, cert) {
    return undefined;
  },
  host: 'hostname',
  port: 8000,
  key: fs.readFileSync('path/to/private_key.pem'),
  cert: fs.readFileSync('path/to/public_cert.pem'),
  rejectUnauthorized: true
};

const client = tls.connect(options, () => {
  if (client.authorized) {
    console.log('Connection authorized by a Certificate Authority.');
  } else {
    console.log('Connection not authorized: ' + client.authorizationError);
  }
  client.setEncoding('utf8');
  client.write('Hello from the client!');
  client.pipe(client);
});

client.on('data', (data) => {
  console.log(data);
});

client.on('end', () => {
  console.log('client disconnected');
});
*/

/*Traffic: Monitor the amount of data being transferred across the network, including both inbound and outbound traffic. This can help identify potential bottlenecks or connectivity issues.

Bandwidth: Monitor the available bandwidth on the network, and track how much of it is being utilized at any given time. This can help identify situations where the network is becoming overloaded.

Latency: Monitor the amount of time it takes for data to travel across the network, also known as "ping" time. High latency can indicate a problem with the network or a specific connection.

Packet loss: Monitor the number of packets that are being lost or dropped during transmission. This can be an indication of a problem with the network or a specific device.

Availability: Monitor the availability of network devices and services. This can include devices like routers, switches, and servers, as well as services like DNS or DHCP.

Security: Monitor network security-related events, such as attempted unauthorized access or suspicious traffic patterns.

CPU, Memory, Disk usage: Monitor the usage of these resources on the devices connected to the network, it can indicate if a device is overloaded and need to be replaced or upgraded.


*/
