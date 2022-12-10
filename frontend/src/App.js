import violatorsServices from "./services/violatorsServices";
import ShowViolators from "./components/ShowViolators";
import ShowClosest from "./components/ShowClosest";
import { useState, useEffect} from 'react'

import "./styles/App.css"
//Compare the distances from the nest. Used to sort the drones
const compareTime = ( a, b ) => {
  if ( a.timeOfRecord< b.timeOfRecord ){
    return 1;
  }
  if ( a.timeOfRecord > b.timeOfRecord ){
    return -1;
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
        setPilots(ndzViolators.sort(compareTime)) // sorting the drones
        setclosestDrone(pilots.filter((pilot) => pilot.isWithinZone === true)[0]) // find the nearest live drone
      })
    },500)
    return () => clearInterval(interval);
  }, [pilots])


  //Nearest drone is featured at the top of the page (unless it doesn't exists).
  //It will also be visible in the "ALL DRONES" list.
  return (
    <div className="App">
      <h4>Link to the codebase: <a href="https://github.com/Sdfeagt/reaktortask" target="_blank" rel="noreferrer noopener">Github</a></h4>
    <ShowClosest violator={closestDrone}/>
    <h1>ALL DRONES THAT HAVE PREVIOUSLY VIOLATED THE NO-FLY ZONE</h1>
    <ShowViolators violators={pilots}/>
    </div>
  );
}

export default App;
