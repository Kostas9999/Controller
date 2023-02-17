const { client } = require("../database/connections/db_pg_connection");
let db_Baseline = require("../baseLine/buildBaseline");
async function onEvent(event) {
  if (typeof event.baseline != "undefined") {
  
    client.query(
      `INSERT INTO  events (type, value, baseline) VALUES ( '${
        event.type
      }',  '${JSON.stringify(event.data.reading)}', '${event.data.baseline}');`
    );

    console.log(
      `TYPE: ${event.type} VALUE: ${JSON.stringify(
        event.data.reading
      )} BASELINE: ${event.data.baseline}, DEVICE: ${event.data.UID} `
    );
  }

  //passive
  if (event.type == "OS_VER") {
    /// console.log(`Type: ${event.type} Readings: ${event.data.readings} baseline: ${event.data.readings}, DEVICE: ${event.data.UID} `);
  }
  if (event.type == "MEM_TOT") {
    // console.log(event.type);
  } // changes in RAM size

  if (event.type == "DSC_FULL") {
    //  console.log(event.type);
  } // hardrive is nearly full

  if (event.type == "MEM_USE") {
    //  console.log(event.type);
  } // high memory usage
  if (event.type == "LAT_LOC") {
    //  console.log(event.type);
  } // local latency
  if (event.type == "LAT_PUB") {
    //  console.log(event.type);
  } // public latency
  if (event.type == "GTW_ADR") {
    db_Baseline.build(event.device);
  } // gateway address has ben changed
  if (event.type == "NGH_NEW") {
    db_Baseline.build(event.device);
  } // new neighbour
  if (event.type == "PRT_NEW") {
    db_Baseline.build(event.device);
  } // new neighbour
  if (event.type == "RX_DRP") {
    // console.log(event.type);
  }
  if (event.type == "RX_ERR") {
    //  console.log(event.type);
  }
  if (event.type == "TX_DRP") {
    //  console.log(event.type);
  }
  if (event.type == "TX_ERR") {
    //  console.log(event.type);
  }
}

module.exports = { onEvent };
