const xml2js = require('xml-js')

const port = 3001;

const express = require('express');
const app = express()

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

let allDrones = []
let combinedInfo = new Map()

//make a function to calculate the distance between the nest and a NDZ drone
const calculateDist = (drone) =>{
  const toRet = Math.sqrt((+drone.positionX._text/1000-250) ** 2 + (+drone.positionY._text/1000-250) ** 2)
  return toRet
}

const getNDZviolations = async() =>{
  //time is declared here, as it needs to be updated
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

      //filter the drones that break the NDZ zone
      //const dronesNDZ = allDrones.filter(drone => calculateDist(drone)<100000)
      //Depracated, we need to actively monitor if every drone is CURRENTLY within zone or not
      //That will be done in the frontend
      const pilots = await Promise.all(
        allDrones.map(async (drone) =>{
          const pilotData = (
            await fetch(
              `https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber._text}`
            ).then(result => result.json())
        )
        return{
          ...pilotData,
          distance: calculateDist(drone),
          timeOfRecord: Date.now(),
        }
      })
      )


      //In the current implementation, the recorded time is the last time the drone was in the NDZ.
      //AKA, the time recorded is the time the drone has left the NDZ
      //We don't need to worry about whether the pilot in question is in the zone, as the drones are alredy filtered
      pilots.forEach((pilot)=>{
        if (combinedInfo.has(pilot.pilotId)){ // update the object if it was previously recorded
          combinedInfo.get(pilot.pilotId).distance = pilot.distance
          combinedInfo.get(pilot.pilotId).timeOfRecord = Date.now()
          combinedInfo.get(pilot.pilotId).isWithinZone = pilot.isWithinZone
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