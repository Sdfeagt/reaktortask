import violatorsServices from "./services/violatorsServices";
import ShowViolators from "./components/ShowViolators";
import ShowClosest from "./components/ShowClosest";
import { useState, useEffect} from 'react'

import "./styles/App.css"

//Compare the time of recording. Used to sort the drones
const compareTime = ( a, b ) => {
  if ( Math.abs((a.timeToDel - Date.now())) < Math.abs((b.timeToDel - Date.now())) ){
    return -1;
  }
  if ( Math.abs((a.timeToDel - Date.now()))> Math.abs((b.timeToDel - Date.now())) ){
    return 1;
  }
  return 0;
}

//Compare the distances from the nest.
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
  
  useEffect(() => {
    const interval = setInterval(() => { // interval calls the getAll() every 0.5 sec, ensuring that the data is updated
    violatorsServices
    .getAll()
      .then(ndzViolators => {
        setPilots(ndzViolators)
        setclosestDrone(ndzViolators.sort(compareDist)[0]) // find the nearest live drone
      })
    },500)
    return () => clearInterval(interval);
  }, [pilots])


  //Nearest drone is featured at the top of the page (unless it doesn't exists).
  //It will also be visible in the "ALL DRONES" list.
  return (
    <div className="App">
      <div className="links">
      <h4>Link to the codebase: <a href="https://github.com/Sdfeagt/reaktortask" target="_blank" rel="noreferrer noopener">Github</a></h4>
      <h4>Link to the assignment: <a href="https://assignments.reaktor.com/birdnest" target="_blank" rel="noreferrer noopener">Reaktor</a></h4>
      </div>
    <ShowClosest violator={closestDrone}/>
    <h1>ALL DRONES THAT HAVE VIOLATED THE NO-FLY ZONE IN THE LAST 10 MIN</h1>
    <ShowViolators violators={pilots.sort(compareTime)}/>
    </div>
  );
}

export default App;
