let db_getBaseline = require("./getBaseline");
const onEvent = require("../events/onEvent");

let curr_gateway;

async function passive(data) {
  db_getBaseline.get(data.UID).then(() => {
    try {
      if (
        data.data.hardware.TotalMemory !==
        db_getBaseline.baseLine[0].data.TotalMemory
      ) {
        onEvent.onEvent({
          type: "MEM_SIZE",
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}

async function mid(data) {
  db_getBaseline.get(data.UID).then(() => {
    data.data.disc.forEach((disc) => {
      if (disc.use > 85) {
        onEvent.onEvent({
          type: "DSC_FULL",
          data: data,
        });
      }
    });

    data.data.ports.forEach((ports) => {
      //  console.log(`${ports.port}`)
    });
  });
}

async function active(data) {
  db_getBaseline.get(data.UID).then(() => {
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
}

module.exports = {
  passive,
  mid,
  active,
};
