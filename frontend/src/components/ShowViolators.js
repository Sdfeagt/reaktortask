import "../styles/showViolators.css"

const inZone = (violator) =>{
if(violator.isWithinZone){
   return("true")
}
else{
  return("false")
}
}
const showViolators = ({violators}) =>{
    return(
        <ul>
        {violators?.map(violator => <div className="violators" key={violator.pilotId}>
        <p>Name and surname of the violator: {violator.firstName} {violator.lastName}</p>
        <p>Email of the violator: {violator.email}</p>
        <p>PhoneNo of the violator: {violator.phoneNumber}</p>
        <p>Latest recorded distance from nest (m): {violator.LastRecordedDistance}</p>
        <p>Last update in the database (min): {(Date.now() - violator.timeOfRecord)/60000}</p>
        <p>Is currently within zone: {inZone(violator)}</p>
        </div>)}
      </ul>
    )
}

export default showViolators