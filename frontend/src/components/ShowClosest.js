import "../styles/showClosest.css"

const showClosest = ({violator}) =>{

     if(violator?.isWithinZone){
        return(
            <div className="showClosest">
            <h4>CLOSEST DRONE CURRENTLY BREAKING THE NO-FLY ZONE</h4>
            <table className="showClosestTable">
                <tbody>
                <tr>
                    <td>Name</td>
                    <td>{violator?.firstName} {violator?.lastName}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{violator?.email}</td>
                </tr>
                <tr>
                    <td>Phone number</td>
                    <td>{violator?.phoneNumber}</td>
                </tr>
                <tr>
                    <td>Last recorded distance (m)</td>
                    <td>{violator?.LastRecordedDistance.toFixed(2)}</td>
                </tr>
            </tbody>
            </table>
           </div>
        )
    }
    else{
        return(
        <div className="showClosest">
        <h4>NO DRONE IS CURRENTLY VIOLATING THE ZONE!</h4>
        </div>
        )
    }
}

export default showClosest