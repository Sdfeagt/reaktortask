const xml2js = require('xml-js')
const fetch = require("node-fetch");
var favicon = require('serve-favicon')
var path = require('path')



const port = process.env.PORT || 3001

const express = require('express');
const app = express()

app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

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
            .catch((error) => {
              console.error('Error:', error)
            })
        )
        return{
          ...pilotData,
          LastRecordedDistance: calculateDist(drone),
          timeToDel: Date.now() + 600000,
          isWithinZone: true
        }
      })
      )


      //check if a drone's location, time of recording and zone state should be updated
      pilots.forEach((pilot)=>{
        if (combinedInfo.has(pilot.pilotId)){ // update the object if it was previously recorded
          if (pilot.LastRecordedDistance <= 100){
          combinedInfo.get(pilot.pilotId).timeOfRecord = Date.now() + 600000
          combinedInfo.get(pilot.pilotId).isWithinZone = true
          if (pilot.LastRecordedDistance < combinedInfo.get(pilot.pilotId).LastRecordedDistance){
            combinedInfo.get(pilot.pilotId).LastRecordedDistance = pilot.LastRecordedDistance
          }
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
      combinedInfo = new Map([...combinedInfo].filter(([key, value]) => Date.now() <= value.timeToDel))
}

setInterval(getNDZviolations, 1000) // update the state every 1 seconds (we are probably not synchronized with Reaktor server, so it's better to check more often than 2 seconds)

app.get('/ndzviolations', (request, response) =>{
  //retrieve data about the current violators
  response.end(JSON.stringify([...combinedInfo.values()]))
})
  
 app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })