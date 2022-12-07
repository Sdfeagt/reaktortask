const xml2js = require('xml-js')

const port = 3001;


const express = require('express');
const { raw } = require('express');
const app = express()

app.use(express.static('build'))

let allDrones = []

const getRawDroneData = async() =>{
    //get the drone data and change to to JSON format
    const xml = await fetch(
        "https://assignments.reaktor.com/birdnest/drones"
      ).then((res) => res.text())
      .catch(function(error){console.log("Error in fetch: ", error);});
      
      const result = xml2js.xml2js(xml, { compact: true });
      const clearData = result.report.capture.drone;
      allDrones = clearData

      //filter the drones here const dronesNDZ = allDrones.filter
}
//make a function to calculate the distance between the nest and a NDZ drone

//setInterval(getRawDroneData, 2000)

app.get('/dronedata', (request, response) => {
    allDrones = getRawDroneData()
    console.log(allDrones);
    response.end(JSON.stringify(allDrones))
  })
  
 app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })