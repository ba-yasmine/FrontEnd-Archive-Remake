import React from 'react'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate} from "react-router-dom"

const NotFound = () => {
  let navigate = useNavigate();
  return (
    <div  id="errdiv" style={{color:"#0243cd",width:"35%", display:"flex", flexDirection:"column", justifyContent:"center", borderRadius:"16px",alignItems:"center", padding:"25px", margin:"auto"}}>
      <h1 style={{}} id="err4">Erreur 404</h1>
      <h3 style={{}}>Page non trouvée</h3>
      <hr/>
      <button style={{backgroundColor:"white", padding:"15px", color:"#0243cd", borderRadius:"15px", border:"2px solid #e5e7eb", fontWeight:"600"}} onClick={() => navigate(-1)}><FontAwesomeIcon style={{color:'#0243cd', marginRight:"10px"}} icon={faArrowLeftLong} />revenir en arrière</button>
    </div>
  )
}

export default NotFound