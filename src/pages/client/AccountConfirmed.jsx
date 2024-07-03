import React,{useEffect,useState,useContext} from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {UserContext} from "../../App"
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import {IoIosArrowRoundBack} from 'react-icons/io'
const AccountConfirmed = () => {

  const {userAuth,setUserAuth} = useContext(UserContext);
const keyLogo = <FontAwesomeIcon size="4x" style={{color:"#0243cd",marginBottom:"30px"}} icon={faCheck}/>
let param=useParams();
const [msg,setmsg] = useState({
    status:"",
    message:""
  })

useEffect(()=>{
let user={id:param.usrId.substring(1)}
axios.post(`${process.env.REACT_APP_HOST_VAR}rest/user/ValidateAccount`,user)
.then(response => setmsg({status:response.status,message:response.data.message}))
},[])

if(msg.message === "") return <Spinner style={{display:"flex", justifyContent:"center", alignItems: "center"}} animation="border" role="status">
<span className="visually-hidden">Loading...</span>
</Spinner>

else if(msg.message === "Compte activé avec succès"){
  return (
    <aside style={{backgroundColor:"white", borderRadius:"5px",padding:'30px',display:"flex", justifyContent:"center", alignItems:"center",marginTop:"30px"}}>
        
  <div  >
  <div id="logo" style={{height:"100px" , margin:"auto",width:"50%", display:"flex", justifyContent:"space-between", alignItems: "center", }}><img style={{margin:"auto"}} src="https://i.postimg.cc/gjHCGwq2/Copie-de-LOGO-Capture-Doc-e1591535465631.png" alt="" width="200" height="auto"></img></div>
    
    <div style={{height:"auto", padding:"50px",margin:"auto",display:"flex",flexDirection:"column",textAlign:"center",}}>

    {keyLogo}
      <h3 style={{color:"#0243cd"}}>
        
        Compte activé avec succès
      </h3>

      <p style={{width:"45%",margin:"auto",marginTop:"50px", fontSize:"17px",color:"#0243cd"}}>
        Maintenant que l'opération s'est terminée, vous pouvez retourner vers la page de connexion et vous connecter à l'aide de vos coordonnées. 
      </p>
    </div>

    <div class="mx-auto mt-8 max-w-xl">
      <form action="#" style={{display: 'flex',justifyContent:'center'}}>
        

        <Button
         style={{backgroundColor:"#ffffff",color:"#0243cd",  border:'2px solid #e5e7eb', marginTop:"60px", borderRadius:"12px"}}
          type="submit"
          class="group mt-4 flex w-full items-center justify-center rounded-md bg-rose-600 px-5 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto"
        >


          <IoIosArrowRoundBack style={{fontSize:"30px"}}/>
          <span class="text-sm font-medium"> <Link style={{textDecoration: "none", fontWeight:'600'}} to="/">Page de connexion</Link> </span>
        </Button>
      </form>
    </div>
  </div>
</aside>
  )
}

else if(msg.message === "vous n'êtes pas inscrit" || msg.status === 403 || msg.status === 404) {
    <aside className="bg-gray-50">
        
    <div style={{marginTop:"50px",backgroundColor:"white", padding:"50px"}} >
    <div id="logo" style={{height:"100px" , margin:"auto",width:"50%", display:"flex", justifyContent:"space-between", alignItems: "center", }}><img style={{margin:"auto"}} src="https://i.postimg.cc/gjHCGwq2/Copie-de-LOGO-Capture-Doc-e1591535465631.png" alt="" width="200" height="auto"></img></div>
      
      <div style={{height:"auto", padding:"50px",margin:"auto",display:"flex",flexDirection:"column",textAlign:"center",}}>
  
      {keyLogo}
        <h3 style={{color:"red"}}>
          
          Echec de l'activation du compte
        </h3>
  
      </div>
  
      <div class="mx-auto mt-8 max-w-xl">
        <form action="#" style={{display: 'flex',justifyContent:'center'}}>
          
  
        <Button
         style={{backgroundColor:"white", marginTop:"60px", borderRadius:"12px", color:"#0243cd", border:"3px solid #0243cd"}}
          type="submit"
          class="group mt-4 flex w-full items-center justify-center rounded-md bg-rose-600 px-5 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto"
        >
          <span class="text-sm font-medium"> <Link style={{textDecoration: "none", color:"#0243cd"}} to="/">Page de connexion</Link> </span>

          <svg
            style={{width:"40px"}}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Button>
        </form>
      </div>
    </div>
  </aside>
}
}
export default AccountConfirmed