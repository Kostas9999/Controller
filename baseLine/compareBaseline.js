const { client } = require("../database/connections/db_pg_connection");
let { getBaselineBuff, updateBaselineBuff } = require("./getBaseline");
const onEvent = require("../events/onEvent");

async function passive(data) {
  let buff_passive = {};
  if (Object.keys(buff_passive).length == 0) {
    await client.query(`SET search_path TO '${data.UID}';`);
    let row = await client.query(
      `SELECT relese, build FROM "${data.UID}"."os" LIMIT 1`
    );
    if (row.rows > 0) {
      buff_passive = {
        relese: row.rows[0].relese.trim(),
        build: row.rows[0].build.trim(),
      };
    }
  }
  if (typeof baseline !== "undefined") {
    if (buff_passive.relese != data.data.os.relese) {
      onEvent.onEvent({
        type: "OS_VER",
        data: {
          UID: data.UID,
          reading: data.data.os.relese,
          baseline: buff_passive.relese,
        },
      });
      buff_passive = {};
    }

    if (buff_passive.build != data.data.os.build) {
      onEvent.onEvent({
        type: "OS_VER",
        data: {
          UID: data.UID,
          reading: data.data.os.build,
          baseline: buff_passive.build,
        },
      });
      buff_passive = {};
    }
  }

  // console.log(await getBaselineBuff(data.UID));

  getBaselineBuff(data.UID).then((baseline) => {
    if (baseline.UID == data.UID && baseline.data) {
      if (baseline.data.memorytotal != null) {
        if (data.data.hardware.TotalMemory != baseline.data.memorytotal) {
          onEvent.onEvent({
            type: "MEM_TOT",
            data: {
              UID: data.UID,
              reading: data.data.hardware.TotalMemory,
              baseline: JSON.stringify(baseline),
            },
          });
        }
      }
    }
  });
}

async function mid(data) {
  data.data.disc.forEach((disc) => {
    if (disc.use > 85) {
      onEvent.onEvent({
        type: "DSC_FULL",
        data: {
          UID: data.UID,
          reading: { disc: disc.fs, use: disc.use },
          baseline: 85,
        },
      });
    }
  });

  data.data.ports.forEach((port) => {
    getBaselineBuff(data.UID).then((baseline) => {
      if (baseline?.UID == data?.UID && baseline?.data) {
        if (baseline.data.ports != null) {
          if (
            !("," + baseline.data.ports + ",").includes("," + port.port + ",")
          ) {
            onEvent.onEvent({
              type: "PRT_NEW",
              data: {
                UID: data.UID,
                reading: port.port,
                baseline: baseline.data.ports,
              },
            });
          }
        }
      }
    });
  });

  data.data.arp.forEach((arp) => {
    getBaselineBuff(data.UID).then((baseline) => {
      if (baseline.UID == data.UID && baseline.data) {
        if (baseline.data.neighbours != null) {
          if (!baseline.data.neighbours.includes(arp.mac)) {
            onEvent.onEvent({
              type: "NGH_NEW",
              data: {
                UID: data.UID,
                reading: { ip: arp.ip, mac: arp.mac },
                baseline: baseline.data.neighbours,
              },
            });
          }
        }
      }
    });
  });
}

async function active(data) {
  getBaselineBuff(data.UID).then((baseline) => {
    if (baseline.UID == data.UID && baseline.data) {
      if (data.data.memory > baseline.data.memoryuses_t) {
        onEvent.onEvent({
          type: "MEM_USE",
          data: {
            UID: data.UID,
            reading: data.data.memory,
            baseline: baseline.data.memoryuses_t,
          },
        });
      }

      if (
        !baseline.data.defaultgateway.includes(data.data.networkStats.dgMAC)
      ) {
        onEvent.onEvent({
          type: "GTW_ADR",
          data: {
            UID: data.UID,
            reading: data.data.networkStats.dgMAC,
            baseline: baseline.data.defaultgateway,
          },
        });
      }

      if (baseline.data.locallatency != null) {
        let n =
          baseline.data.locallatency * (baseline.data.locallatency_t / 100);
        if (n < 10) {
          n = 10;
        }
        if (data.data.networkStats.localLatency > n) {
          onEvent.onEvent({
            type: "LAT_LOC",
            data: {
              UID: data.UID,
              reading: data.data.networkStats.localLatency,
              baseline: n,
            },
          });
        }
      }
      if (baseline.data.publiclatency != null) {
        let m =
          baseline.data.publiclatency * (baseline.data.publiclatency_t / 100);
        if (data.data.networkStats.publicLatency > m) {
          onEvent.onEvent({
            type: "LAT_PUB",
            data: {
              UID: data.UID,
              reading: data.data.networkStats.publicLatency,
              baseline: m,
            },
          });
        }
      }

      if (data.data.networkStats.rx_dropped) {
        onEvent.onEvent({
          type: "RX_DRP",
          data: {
            UID: data.UID,
            reading: data.data.networkStats.rx_dropped,
            baseline: 0,
          },
        });
      }

      if (data.data.networkStats.rx_error) {
        onEvent.onEvent({
          type: "RX_ERR",
          data: {
            UID: data.UID,
            reading: data.data.networkStats.rx_error,
            baseline: 0,
          },
        });
      }

      if (data.data.networkStats.tx_dropped) {
        onEvent.onEvent({
          type: "TX_DRP",
          data: {
            UID: data.UID,
            reading: data.data.networkStats.tx_dropped,
            baseline: 0,
          },
        });
      }

      if (data.data.networkStats.tx_error) {
        onEvent.onEvent({
          type: "TX_ERR",
          data: {
            UID: data.UID,
            reading: data.data.networkStats.tx_error,
            baseline: 0,
          },
        });
      }
    }
  });
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
