const xml2js = require('xml-js')

const port = 3001;


const express = require('express');
const { raw } = require('express');
const app = express()

app.use(express.static('build'))

let allDrones = []

//make a function to calculate the distance between the nest and a NDZ drone
const calculateDisct = (drone) =>{
  const toRet = Math.sqrt((drone.positionX-250000) ** 2 + (drone.positionY-250000) ** 2)
  return toRet
}

const getNDZviolations = async() =>{
    //get the drone data and change to to JSON format
    const xml = await fetch(
        "https://assignments.reaktor.com/birdnest/drones"
      ).then((res) => res.text())
      .catch(function(error){console.log("Error in fetch: ", error);});
      
      const result = xml2js.xml2js(xml, { compact: true });
      const clearData = result.report.capture.drone;
      allDrones = clearData

      //filter the drones that break the NDZ zone
      const dronesNDZ = allDrones.filter(drone => calculateDisct(drone)<100)

      //TODO: fetch the pilot data, and get only the ones that match with drone serial number.
      //After that, figure out a way to store all of that for 10 minutes.
}

setInterval(getRawDroneData, 2000)

app.get('/dronedata', (request, response) => {
    allDrones = getNDZviolations()
    console.log(allDrones);
    response.end(JSON.stringify(allDrones))
  })
  
 app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })