import "../styles/showClosest.css"

const showClosest = ({violator}) =>{

     if(violator?.isWithinZone){
        return(
            <div className="closest">
            <h1>CLOSEST DRONE CURRENTLY BREAKING THE NO-FLY ZONE</h1>
            <p>Name and surname of the violator: {violator?.firstName} {violator?.lastName}</p>
            <p>Email of the violator: {violator?.email}</p>
            <p>PhoneNo of the violator: {violator?.phoneNumber}</p>
            <p>Latest recorded distance from nest (m): {violator?.LastRecordedDistance}</p>
            <p>Last update in the database (min): {(Date.now() - violator?.timeOfRecord)/60000}</p>
           </div>
        )
    }
    else{
        return(
        <div className="closest">
        <h1>No drone is currently violating the zone!</h1>
        </div>
        )
    }
}

export default showClosest