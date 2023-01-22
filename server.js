const dgram = require("dgram");
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
/*

const tls = require('tls');
const fs = require('fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};

const server = tls.createServer(options, (socket) => {
  console.log('client connected',
    socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('Welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});

server.listen(8000, () => {
  console.log('server bound');
});
/*Traffic: Monitor the amount of data being transferred across the network, including both inbound and outbound traffic. This can help identify potential bottlenecks or connectivity issues.

Bandwidth: Monitor the available bandwidth on the network, and track how much of it is being utilized at any given time. This can help identify situations where the network is becoming overloaded.

Latency: Monitor the amount of time it takes for data to travel across the network, also known as "ping" time. High latency can indicate a problem with the network or a specific connection.

Packet loss: Monitor the number of packets that are being lost or dropped during transmission. This can be an indication of a problem with the network or a specific device.

Availability: Monitor the availability of network devices and services. This can include devices like routers, switches, and servers, as well as services like DNS or DHCP.

Security: Monitor network security-related events, such as attempted unauthorized access or suspicious traffic patterns.

CPU, Memory, Disk usage: Monitor the usage of these resources on the devices connected to the network, it can indicate if a device is overloaded and need to be replaced or upgraded.


*/
