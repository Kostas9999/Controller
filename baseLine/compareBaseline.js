const { client } = require("../database/connections/db_pg_connection");
let { getBaselineBuff, updateBaselineBuff } = require("./getBaseline");
const onEvent = require("../events/onEvent");
let buff_passive = {};

async function passive(data) {
  let buff_passive = {};
  if (Object.keys(buff_passive).length == 0) {
    let row = await client.query(`SELECT relese, build FROM os LIMIT 1`);
    buff_passive = {
      relese: row.rows[0].relese.trim(),
      build: row.rows[0].build.trim(),
    };
  }

  if (buff_passive.relese != data.data.os.relese) {
    onEvent.onEvent({
      type: "OS_VER",
      data: `OS relese has been changed ${buff_passive.relese}  -> ${data.data.os.relese}`,
    });
    buff_passive = {};
  }

  if (buff_passive.build != data.data.os.build) {
    onEvent.onEvent({
      type: "OS_VER",
      data: `OS build has been changed ${buff_passive.build}  -> ${data.data.os.build}`,
    });
    buff_passive = {};
  }

  getBaselineBuff(data.UID).then((baseline) => {
    if (data.data.hardware.TotalMemory != baseline.memorytotal) {
      onEvent.onEvent({
        type: "MEM_TOT",
        data: `RAM size has been changed ${data.data.hardware.TotalMemory}  -> ${baseline.memorytotal}`,
      });
    }
  });
}
async function mid(data) {
  data.data.disc.forEach((disc) => {
    if (disc.use > 85) {
      onEvent.onEvent({
        type: "DSC_FULL",
        data: `Disk nearly full ${disc.fs}  -> ${disc.use}`,
      });
    }
  });

  data.data.ports.forEach((port) => {
    getBaselineBuff(data.UID).then((baseline) => {
      if (!("," + baseline.ports + ",").includes("," + port.port + ",")) {
        onEvent.onEvent({
          type: "PRT_NEW",
          data: `New open port detected ${port.port}`,
        });
      }
    });
  });

  data.data.arp.forEach((arp) => {
    getBaselineBuff(data.UID).then((baseline) => {
      if (!baseline.neighbours.includes(arp.mac)) {
        onEvent.onEvent({
          type: "NGH_NEW",
          data: `New neighbour detected ${arp.ip} ${arp.mac} `,
        });
      }
    });
  });
}

async function active(data) {
  getBaselineBuff(data.UID).then((baseline) => {
    if (data.data.memory > baseline.memoryuses_t) {
      onEvent.onEvent({
        type: "MEM_USE",
        data: `High memory usage ${data.data.memory}  `,
      });
    }

    if (!baseline.defaultgateway.includes(data.data.networkStats.dgMAC)) {
      onEvent.onEvent({
        type: "GTW_ADR",
        data: `Defaultgateway MAC address has ben changed  ${data.data.networkStats.dgMAC}  `,
      });
    }

    let n = baseline.locallatency * (baseline.locallatency_t / 100);
    if (data.data.networkStats.localLatency > n) {
      onEvent.onEvent({
        type: "LAT_LOC",
        data: `High local latency  ${data.data.networkStats.localLatency}`,
      });
    }

    let m = baseline.publiclatency * (baseline.publiclatency_t / 100);
    if (data.data.networkStats.publicLatency > m) {
      onEvent.onEvent({
        type: "LAT_PUB",
        data: `High public latency  ${data.data.networkStats.publicLatency}`,
      });
    }
  });

  if (data.data.networkStats.rx_dropped) {
    onEvent.onEvent({
      type: "RX_DRP",
      data: `rx_dropped  ${data.data.networkStats.rx_dropped}`,
    });
  }

  if (data.data.networkStats.rx_error) {
    onEvent.onEvent({
      type: "RX_ERR",
      data: `rx_error  ${data.data.networkStats.rx_error}`,
    });
  }

  if (data.data.networkStats.tx_dropped) {
    onEvent.onEvent({
      type: "TX_DRP",
      data: `tx_dropped  ${data.data.networkStats.tx_dropped}`,
    });
  }

  if (data.data.networkStats.tx_error) {
    onEvent.onEvent({
      type: "TX_ERR",
      data: `tx_error  ${data.data.networkStats.tx_error}`,
    });
  }

  // console.log(data.data.networkStats.rx_dropped);
}
/*


async function active(data) {
  getBaselineBuff(data.UID).then(() => {
    console.log(db_getBaseline.baseLine);

    if (data.data.memory > db_getBaseline.baseLine[0].data.MemoryUses) {
      onEvent.onEvent({
        type: "MEM_USE",
        data: data,
      });
    }

    if (
      data.data.networkStats.localLatency >
      db_getBaseline.baseLine[0].data.LocalLatency
    ) {
      onEvent.onEvent({
        type: "LAT_LOC",
        data: data,
      });
    }

    if (
      data.data.networkStats.publicLatency >
      db_getBaseline.baseLine[0].data.PublicLatency
    ) {
      onEvent.onEvent({
        type: "LAT_PUB",
        data: data,
      });
    }

    if (
      data.data.networkStats.defaultGateway !==
      db_getBaseline.baseLine[0].data.defaultGatewayy
    ) {
      if (curr_gateway != data.data.networkStats.defaultGateway) {
        console.log(curr_gateway + " " + data.data.networkStats.defaultGateway);
        onEvent.onEvent({
          type: "GTW_ADR",
          data: data,
        });
      }
      curr_gateway = data.data.networkStats.defaultGateway;
    }
    // TODO: tx rx
  });
*/

module.exports = {
  passive,
  mid,
  active,
};
