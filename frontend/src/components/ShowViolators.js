import "../styles/showViolators.css"

const inZone = (violator) =>{
if(violator.isWithinZone){
   return("Yes")
}
else{
  return("No")
}
}
const getTime = (violator) =>{
  let date = new Date(violator.timeToDel);
  let time = date.toLocaleTimeString()
  return(time)
}
const showViolators = ({violators}) =>{
  if (violators.length !== 0){
    return(
        <table className="showViolators">
          <tbody>
          <tr>
          <td>Name</td>
          <td>Email</td>
          <td>Phone number</td>
          <td>Shortest recorded distance (m)</td>
          <td>Time in the database (min) <br/>Time of deletion</td>
          <td>Is currently within the zone</td>
          </tr>
          </tbody>
          {violators?.map(violator =>
            <tbody className="violators" key={violator.pilotId}><tr>
            <td>{violator.firstName} {violator.lastName}</td>
            <td>{violator.email}</td>
            <td>{violator.phoneNumber}</td>
            <td> {violator.LastRecordedDistance.toFixed(2)}</td>
            <td> {(Math.abs((600000 - (violator.timeToDel - Date.now()))/60000)).toFixed(2)} <br/>{getTime(violator)}</td>
            <td className = {inZone(violator)}>{inZone(violator)}</td>
          </tr></tbody>)}
      </table>
    )
  }
  else{
    return(
      <h4>If you see that, the server needs to populate with data. Let it run for a few minutes please.</h4>
    )
  }
}

export default showViolators