async function onEvent(event) { 

   // console.log(event)

   if(event.type == "DSC_FULL"){console.log(event.type)}
   if(event.type == "MEM_USE"){console.log(event.type)}
   if(event.type == "LAT_LOC"){console.log(event.type)}
   if(event.type == "LAT_PUB"){console.log(event.type)}
   if(event.type == "GTW_ADR"){console.log(event.type)}
 }

module.exports = {onEvent}