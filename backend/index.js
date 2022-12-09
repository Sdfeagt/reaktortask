const xml2js = require('xml-js')

const port = process.env.PORT || 3001

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

//get the drone data and change to to JSON format
const getNDZviolations = async() =>{
    const xml = await fetch(
        "https://assignments.reaktor.com/birdnest/drones"
      ).then((res) => res.text())
      .catch((error) => {
        console.error('Error:', error)
      })
      const result = xml2js.xml2js(xml, { compact: true });
      const clearData = result.report.capture.drone;
      allDrones = clearData

      //connect every drone to it's pilot
      const pilots = await Promise.all(
        allDrones.map(async (drone) =>{
          const pilotData = (
            await fetch(
              `https://assignments.reaktor.com/birdnest/pilots/${drone.serialNumber._text}`
            ).then(result => result.json())
        )
        return{
          ...pilotData,
          LastRecordedDistance: calculateDist(drone),
          timeOfRecord: Date.now(),
          isWithinZone: true
        }
      })
      )


      //check if a drone's location, time of recording and zone state should be updated
      pilots.forEach((pilot)=>{
        if (combinedInfo.has(pilot.pilotId)){ // update the object if it was previously recorded
          if (pilot.LastRecordedDistance <= 100){
          combinedInfo.get(pilot.pilotId).LastRecordedDistance = pilot.LastRecordedDistance
          combinedInfo.get(pilot.pilotId).timeOfRecord = Date.now() 
          combinedInfo.get(pilot.pilotId).isWithinZone = true
          }
          else{
            combinedInfo.get(pilot.pilotId).isWithinZone = false
          }
        }
        else if (pilot.LastRecordedDistance <= 100){// setup the new object that entered the zone
          combinedInfo.set(pilot.pilotId, pilot)
          } 

          //other drones, that are outside the zone and have never entered it, are not recorded
      })

      //Here ensure that if the pilot information is deleted after 10 minutes from leaving the zone
      combinedInfo = new Map([...combinedInfo].filter(([key, value]) =>(Date.now() - value.timeOfRecord)/60000 <= 10))
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