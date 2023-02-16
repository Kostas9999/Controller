async function onEvent(event) {
  // console.log(event)
  console.log(`${event.type} ${event.data}`);

  //passive
  if (event.type == "OS_VER") {
  }
  if (event.type == "MEM_TOT") {
    console.log(event.type);
  } // changes in RAM size

  if (event.type == "DSC_FULL") {
    console.log(event.type);
  } // hardrive is nearly full




  
  if (event.type == "MEM_USE") {
    console.log(event.type);
  } // high memory usage
  if (event.type == "LAT_LOC") {
    console.log(event.type);
  } // local latency
  if (event.type == "LAT_PUB") {
    console.log(event.type);
  } // public latency
  if (event.type == "GTW_ADR") {
    console.log(event.type);
  } // gateway address has ben changed
  if (event.type == "NGH_NEW") {
    console.log(event.type);
  } // new neighbour
  if (event.type == "PRT_NEW") {
    console.log(event.type);
  } // new neighbour
  if (event.type == "RX_DRP") {
    console.log(event.type);
  }
  if (event.type == "RX_ERR") {
    console.log(event.type);
  }
  if (event.type == "TX_DRP") {
    console.log(event.type);
  }
  if (event.type == "TX_ERR") {
    console.log(event.type);
  }
}

module.exports = { onEvent };
