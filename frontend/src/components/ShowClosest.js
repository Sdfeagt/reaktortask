import "../styles/showClosest.css"
const showClosest = ({violator}) =>{
    let inZone =""
     if(violator?.distance <= 100){
        inZone =  "true"
    }
    else{
        inZone = "false"
    }
    return(
        <div className="closest">
        <h1>CLOSEST DRONE TO THE NEST</h1>
        <p>Name and surname of the violator: {violator?.firstName} {violator?.lastName}</p>
        <p>Email of the violator: {violator?.email}</p>
        <p>PhoneNo of the violator: {violator?.phoneNumber}</p>
        <p>Latest recorded distance from nest (m): {violator?.distance}</p>
        <p>Last update in the database (min): {(Date.now() - violator?.timeOfRecord)/60000}</p>
        <p>Is currently within zone: {inZone}</p>
       </div>
    )
}

export default showClosest