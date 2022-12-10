import "../styles/showClosest.css"

const showClosest = ({violator}) =>{
        return(
            <div className="showClosest">
            <h4>PILOT THAT FLEW THE CLOSEST TO THE NEST IN THE NDZ</h4>
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
                    <td>Distance (m)</td>
                    <td>{violator?.LastRecordedDistance.toFixed(2)}</td>
                </tr>
            </tbody>
            </table>
           </div>
        )
    }

export default showClosest