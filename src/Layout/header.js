
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'bootstrap';
import React  from 'react'
import { useNavigate} from "react-router-dom";


const Header = ({title, arrow}) => {
    let navigate = useNavigate();
    const arrowLeftIco = <FontAwesomeIcon onClick={() => navigate(-1)}  style={{color:'#0243cd', marginRight:"10px"}} icon={faArrowLeftLong}/>
  return (
    <div style={{ zIndex:'5',   display:'flex',justifyContent: 'space-between',alignItems:'center', color:'#0243cd', width:'80%', height:'8%', borderBottom:"2px solid #e5e7eb", paddingLeft:'20px', backgroundColor:'white', position:'fixed', paddingBottom:'8px', paddingRight:"10px"}}>
       <div>
        <h5 style={{marginBottom:"0px"}}>{arrow === true  ?  arrowLeftIco : <p></p> }  {title} </h5>
       </div>
       <div>
       <img  style={{width:"150px"}} src="https://i.postimg.cc/q7kbpC3j/cdlogo.png" alt="" height="auto"></img>
       </div>
    </div>
  )
}

export default Header