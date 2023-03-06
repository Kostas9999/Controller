const { client } = require("../database/connections/db_pg_connection");

async function solveText(subject, data) {
  let reason = await mapSubject(subject);
  ("<h1>Welcome</h1>");

  let response = ` ${reason} 
 [Reading]  -> ${data.reading}
 [Baseline] -> ${data.baseline}
  `;
  return response;
}

async function mapSubject(subject) {
  switch (subject) {
    case "GTW_ADR":
      return "Gateway MAC address has been changed";
    case "LAT_LOC":
      return "Local latency is to high";
    case "LAT_PUB":
      return "Public latency is to high";
    case "DSC_FULL":
      return "Disk is full";
    case "MEM_USE":
      return "High memory (RAM) usage";
    case "MEM_TOT":
      return "RAM size has been changed";
    case "OS_VER":
      return "Operating system has been updated";
    case "PRT_NEW":
      return "New open port";
    case "NGH_NEW":
      return "New device on a network";
    case "RX_DRP":
      return "RX Packet was dropped";
    case "RX_ERR":
      return "RX Packet with errors";
    case "TX_DRP":
      return "TX Packet was dropped";
    case "TX_ERR":
      return "TX Packet with errors";
    default:
      "none";
  }
}

module.exports = { solveText };

/*
GTW_ADR,
LAT_LOC,
LAT_PUB,
DSC_FULL,
MEM_USE,
MEM_TOT,
OS_VER,
PRT_NEW,
NGH_NEW,
RX_DRP,RX_ERR,TX_DRP,TX_ERR
*/
