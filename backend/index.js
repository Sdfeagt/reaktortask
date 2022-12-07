const xml2js = require('xml-js')

const port = 3001;

const express = require('express');
const app = express()

app.use(express.static('build'))

let allDrones = []
let allDronesDict = new Map()
let combinedInfo = new Map()

//make a function to calculate the distance between the nest and a NDZ drone
const calculateDist = (drone) =>{
  const toRet = Math.sqrt((+drone.positionX._text-250000) ** 2 + (+drone.positionY._text-250000) ** 2)
  return toRet
}

const getNDZviolations = async() =>{
  //time is declared here, as it needs to be updated
  let date = new Date
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  let currentTime = {hour, minutes, seconds}
    //get the drone data and change to to JSON format
    const xml = await fetch(
        "https://assignments.reaktor.com/birdnest/drones"
      ).then((res) => res.text())
      .catch((error) => {
        console.error('Error:', error)
      })
      const result = xml2js.xml2js(xml, { compact: true });
      const clearData = result.report.capture.drone;
      allDrones = clearData

      allDrones.forEach((drone)=>{
        allDronesDict.set(drone.serialNumber._text, drone)
      })

      //filter the drones that break the NDZ zone
      const dronesNDZ = allDrones.filter(drone => calculateDist(drone)<100000)

      const pilotsNDZ = await Promise.all(
        dronesNDZ.map(async (drone) =>{
          const pilotData = (
            await fetch(
              `https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber._text}`
            ).then(result => result.json())
        )
        return{
          ...pilotData,
          distance: calculateDist(drone),
          timeOfRecord: currentTime
        }
      })
      )

      //In the current implementation, the recorded time is the last time the drone was in the NDZ.
      //AKA, the time recorded is the time the drone has left the NDZ
      //We don't need to worry about whether the pilot in question is in the zone, as the drones are alredy filtered
      pilotsNDZ.forEach((pilot)=>{
        if (combinedInfo.has(pilot.pilotId)){ // update the object if it was previously recorded
          console.log("Need to update");
          combinedInfo.get(pilot.pilotId).distance = pilot.distance
          combinedInfo.get(pilot.pilotId).timeOfRecord = currentTime

        }
        else{
          combinedInfo.set(pilot.pilotId, pilot) // setup the new object
        }
      })

      //Here ensure that if the pilot information was recorded 10 minutes ago, then delete him
}

setInterval(getNDZviolations, 2000) // update the state every 2 seconds

app.get('/dronedata', (request, response) => {
  //retrieve data about all the drones
    response.end(JSON.stringify(allDrones))
  })

app.get('/ndzviolations', (request, response) =>{
  //retrieve data about the current violators
  response.end(JSON.stringify([...combinedInfo.values()]))
})
  
 app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })