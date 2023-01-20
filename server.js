const net = require("net");
const port = 7070;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(port, host, () => {
  console.log("TCP Server is running on port " + port + ".");
});

//let sockets = [];

server.on("connection", function (sock) {
  console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
  //sockets.push(sock);

  sock.on("data", function (data) {
    console.log("" + data);
  });

  sock.on("error", function (data) {
    console.log("DATA " + sock.remoteAddress + ": " + data);
  });

  // Add a 'close' event handler to this instance of socket
  sock.on("close", function (data) {
    console.log("closed " + data);
  });
});
