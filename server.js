const dgram = require("dgram");
const net = require("net");

const TCP_socket = net.createServer();
const UDP_socket = dgram.createSocket("udp4");

UDP_socket.on("message", (msg, user) => {
  console.log("\n\r" + msg + "\n\r");
});

TCP_socket.on("connection", function (sock) {
  console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);

  sock.on("data", function (data) {
    console.log("" + data);
  });

  sock.on("close", function () {
    console.log("closed " + sock.remoteAddress + ":" + sock.remotePort);
  });
});
UDP_socket.bind(7070);
TCP_socket.listen(7070);
