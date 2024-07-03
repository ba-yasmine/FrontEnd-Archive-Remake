import React, {useContext,useEffect,useState } from 'react'
import "./timelineStyle.css"
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons'
import {headerTitleContext} from '../../Layout/layout'
import {UserContext} from "../../App"
import { useParams } from "react-router-dom";

function removeUnderscores(str) {
    // Supprime les underscores
    let newStr = str.replace(/_/g, ' ');
    // Convertit tout en minuscules
    newStr = newStr.toLowerCase();
    return newStr;
  }
  
  function getDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

const SuiviLot = () => {


    const {userAuth,setUserAuth} = useContext(UserContext);
    const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
    const [Expand,setExpand] = useState([])
    let params  = useParams();
  

    useEffect(() => {
        setheaderTitle('Suivi du lot ' + params.lotID )
        setheaderArrow(true)
      })


      useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/batches/getBatchStatuses/${params.lotID}`,{ headers:{
            'Authorization':  "Bearer" + userAuth.token
          }})
          .then((response) =>{
          

            setExpand(response.data.sort((a,b) => new Date(a.statusDate).getTime()  - new Date(b.statusDate).getTime() ));
            
                 
               }
              )
        
      }, [])
      
    

  return (
    <div style={{}} >
      
       <main  >
      
       
       <div class="container" style={{}}>                      
    <div class="row text-center justify-content-center mb-5">
     
    </div>
    <div class="container-fluid py-5">

  <div class="row">
    <div class="col-lg-12">

      <div class="horizontal-timeline">

        <ul class="list-inline items">
        {Expand !== null ? Expand.map((el,id)=>{

return   <li key={id} style={{marginTop:"70px", marginRight:"50px", marginLeft:"50px"}} class="list-inline-item items-list">
<div class="px-4">
  <div style={{backgroundColor:"#0243cd", fontWeight:"600"}} class="event-date badge w-auto">{getDateTime(el.statusDate)}</div>
  <h6 class="pt-2">{removeUnderscores(el.statut.batchStatus)}</h6>
 
</div>
</li>

})
: <h5>Suivi indisponible</h5>}
         
         
        </ul>

      </div>

    </div>
  </div>

</div>

  
</div>


       </main>
     </div>
  )
}

export default SuiviLot