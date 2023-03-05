const { client } = require("../database/connections/db_pg_connection");
let { clearBaselineBuffer } = require("../baseLine/getBaseline");
let db_Baseline = require("../baseLine/buildBaseline");
const { sendMail } = require("../email/email");

let suppressEvent = {};
// {
// uid:  device id {
//        type: type of event eg. "MEM_TOT"
//        time: time taken
//        timeout: turn of duration to suppress [0 = forever (until reset)]
//            }
// }

async function onEvent(event) {
  if (typeof event.data.baseline != "undefined") {
    client.query(
      `INSERT INTO  "${
        event.data.UID
      }"."events" (type, value, baseline) VALUES ( '${
        event.type
      }',  '${JSON.stringify(event.data.reading)}', '${event.data.baseline}');`
    );

    /*
    console.log(
      `TYPE: ${event.type} VALUE: ${JSON.stringify(
        event.data.reading
      )} BASELINE: ${event.data.baseline}, DEVICE: ${event.data.UID} `
    );
    */
  }

  //passive
  if (event.type == "OS_VER") {
    /// console.log(`Type: ${event.type} Readings: ${event.data.readings} baseline: ${event.data.readings}, DEVICE: ${event.data.UID} `);
  }
  if (event.type == "MEM_TOT") {
    if (
      suppressEvent[event.data.UID]?.mem_tot === undefined ||
      suppressEvent[event.data.UID]?.mem_tot != event.type
    ) {
      suppressEvent[event.data.UID] = { mem_tot: event.data.reading };
      sendMail(event.data.UID, event.type, {
        reading: event.data.reading,
        baseline: event.data.baseline,
      });
    }
  } // changes in RAM size

  if (event.type == "DSC_FULL") {
    if (
      suppressEvent[event.data.UID]?.dsk_full === undefined ||
      suppressEvent[event.data.UID]?.dsk_full < event.type
    ) {
      suppressEvent[event.data.UID] = { dsk_full: event.data.reading };
      sendMail(event.data.UID, event.type, {
        reading: event.data.reading,
        baseline: event.data.baseline,
      });
    }
  } // hardrive is nearly full

  if (event.type == "MEM_USE") {
    if (
      suppressEvent[event.data.UID]?.mem_use === undefined ||
      suppressEvent[event.data.UID]?.mem_use < event.type
    ) {
      suppressEvent[event.data.UID] = { mem_use: event.data.reading };
      sendMail(event.data.UID, event.type, {
        reading: event.data.reading,
        baseline: event.data.baseline,
      });
    }
  } // high memory usage
  if (event.type == "LAT_LOC") {
    //  console.log(event.type);
  } // local latency
  if (event.type == "LAT_PUB") {
    //  console.log(event.type);
  } // public latency
  if (event.type == "GTW_ADR") {
    clearBaselineBuffer(event.data.UID);
    db_Baseline.build(event.data.UID);
    sendMail(event.data.UID, event.type, {
      reading: event.data.reading,
      baseline: event.data.baseline,
    });
  } // gateway address has ben changed
  if (event.type == "NGH_NEW") {
    clearBaselineBuffer(event.data.UID);
    db_Baseline.build(event.data.UID);
    sendMail(event.data.UID, event.type, {
      reading: event.data.reading,
      baseline: event.data.baseline,
    });
  } // new neighbour
  if (event.type == "PRT_NEW") {
    clearBaselineBuffer(event.data.UID);
    db_Baseline.build(event.data.UID);
    sendMail(event.data.UID, event.type, {
      reading: event.data.reading,
      baseline: event.data.baseline,
    });
  } // new neighbour
  if (event.type == "RX_DRP") {
    if (
      suppressEvent[event.data.UID]?.rx_drop === undefined ||
      suppressEvent[event.data.UID]?.rx_drop < event.type
    ) {
      suppressEvent[event.data.UID] = { rx_drop: event.data.reading };
      sendMail(event.data.UID, event.type, {
        reading: event.data.reading,
        baseline: event.data.baseline,
      });
    }
  }
  if (event.type == "RX_ERR") {
    if (
      suppressEvent[event.data.UID]?.rx_error === undefined ||
      suppressEvent[event.data.UID]?.rx_error < event.type
    ) {
      suppressEvent[event.data.UID] = { rx_error: event.data.reading };
      sendMail(event.data.UID, event.type, {
        reading: event.data.reading,
        baseline: event.data.baseline,
      });
    }
  }
  if (event.type == "TX_DRP") {
    if (
      suppressEvent[event.data.UID]?.tx_drop === undefined ||
      suppressEvent[event.data.UID]?.tx_drop < event.type
    ) {
      suppressEvent[event.data.UID] = { tx_drop: event.data.reading };
      sendMail(event.data.UID, event.type, {
        reading: event.data.reading,
        baseline: event.data.baseline,
      });
    }
  }
  if (event.type == "TX_ERR") {
    if (
      suppressEvent[event.data.UID]?.tx_error === undefined ||
      suppressEvent[event.data.UID]?.tx_error < event.type
    ) {
      suppressEvent[event.data.UID] = { tx_error: event.data.reading };
      sendMail(event.data.UID, event.type, {
        reading: event.data.reading,
        baseline: event.data.baseline,
      });
    }
  }
}

module.exports = { onEvent };
