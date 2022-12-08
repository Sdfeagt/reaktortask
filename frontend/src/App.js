import violatorsServices from "./services/violatorsServices";
import ShowViolators from "./components/ShowViolators";
import ShowClosest from "./components/ShowClosest";
import { useState, useEffect} from 'react'

//TODO: What if no drones are currently in the zone?
//Program will show the nearest RECORDED drone, and it may already be gone
const compareDist = ( a, b ) => {
  if ( a.distance< b.distance ){
    return -1;
  }
  if ( a.distance > b.distance ){
    return 1;
  }
  return 0;
}

const App = () => {
  const [pilots, setPilots] = useState([])
  const [ndzViolators, setndzViolators] = useState([])
  let persistentData = new Map()
  
  useEffect(() => {
    const interval = setInterval(() => { // interval calls the getAll() every 2 sec, ensuring that the data is updated
    violatorsServices
    .getAll()
      .then(ndzViolators => {
        setPilots(ndzViolators)
      })
      //const inDistance = pilots.filter((violator) => violator.distance <= 200)
      //inDistance.sort((violator) => violator.distance)
      //setndzViolators(inDistance)
      pilots.forEach((pilot)=>{
        if (persistentData.has(pilot.Id) && pilot.distance > 100){
          //drone has left the zone, persist the data for 10 minutes from now on
        }
        else if (persistentData.has(pilot.Id) && pilot.distance < 100){
          //pilot is still in the zone, update the timeOfRecord
        }
        else if (!persistentData.has(pilot.Id)&& pilot.distance < 100){
          //new drone in the zone, record it here
        }
      })
    },2000)
    return () => clearInterval(interval);
  }, [pilots])


  ndzViolators.sort(compareDist)

  const closestDrone = ndzViolators[0]
  ndzViolators.shift()

  return (
    <div className="App">
    <ShowClosest violator={closestDrone}/>
    <h1>Other drones in the database. Distance from the nest is given as an additional information</h1>
    <ShowViolators violators={ndzViolators}/>
    </div>
  );
}

export default App;
