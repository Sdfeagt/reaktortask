import "../styles/showViolators.css"

const inZone = (violator) =>{
if(violator.isWithinZone){
   return("Yes")
}
else{
  return("No")
}
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
          <td>Time in the database (min)</td>
          <td>Is currently within the zone</td>
          </tr>
          </tbody>
          {violators?.map(violator => <tbody className="violators" key={violator.pilotId}><tr>
            <td>{violator.firstName} {violator.lastName}</td>
            <td>{violator.email}</td>
            <td>{violator.phoneNumber}</td>
            <td> {violator.LastRecordedDistance.toFixed(2)}</td>
            <td> {Math.abs((violator.timeToDel - Date.now())/60000).toFixed(2)}</td>
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