import violatorsServices from "./services/violatorsServices";
import ShowViolators from "./components/ShowViolators";
import ShowClosest from "./components/ShowClosest";
import { useState, useEffect} from 'react'

//TODO: What if no drones are currently in the zone?
//Program will show the nearest RECORDED drone, and it may already be gone
const compareDist = ( a, b ) => {
  if ( a.LastRecordedDistance< b.LastRecordedDistance ){
    return -1;
  }
  if ( a.LastRecordedDistance > b.LastRecordedDistance ){
    return 1;
  }
  return 0;
}

const App = () => {
  const [pilots, setPilots] = useState([])
  const [closestDrone, setclosestDrone] = useState(null)
  const [dronesWithoutClosest, setdronesWithoutClosest] = useState([])
  
  useEffect(() => {
    const interval = setInterval(() => { // interval calls the getAll() every 2 sec, ensuring that the data is updated
    violatorsServices
    .getAll()
      .then(ndzViolators => {
        setPilots(ndzViolators.sort(compareDist))
        setclosestDrone(pilots.filter((pilot) => pilot.isWithinZone === true)[0])
      })
    },2000)
    return () => clearInterval(interval);
  }, [pilots])



  return (
    <div className="App">
    <ShowClosest violator={closestDrone}/>
    <h1>ALL DRONES THAT HAVE PREVIOUSLY VIOLATED THE NO-FLY ZONE</h1>
    <ShowViolators violators={pilots}/>
    </div>
  );
}

export default App;
