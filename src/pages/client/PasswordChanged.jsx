import React,{useEffect,useState,useContext} from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {UserContext} from "../../App"
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'

const PasswordChanged = () => {
  const {userAuth,setUserAuth,styleMode} = useContext(UserContext);
  const keyLogo = <FontAwesomeIcon size="3x" style={{color:"#0243cd",marginBottom:"30px"}} icon={faKey}/>
let param=useParams();
const [newpassword,setpassword]= useState(false)
useEffect(()=>{

axios.put(`${process.env.REACT_APP_HOST_VAR}rest/user/sendmail/${param.usrId.substring(1)}/${param.newpassword.substring(1)}`)
.then(response => setpassword(true))
})

if(newpassword === false) return <Spinner animation="border" role="status">
<span style={{color:"blue", margin:"auto"}} className="visually-hidden">Loading...</span>
</Spinner>

else {
  return (
    <aside  style={{overflowY: "hidden"}} className="bg-gray-50">
        
  <div style={{marginTop:"50px",backgroundColor:"white", padding:"50px"}} >
  <div id="logo" style={{height:"100px" , margin:"auto",width:"50%", display:"flex", justifyContent:"space-between", alignItems: "center", }}><img style={{margin:"auto"}} src="https://i.postimg.cc/gjHCGwq2/Copie-de-LOGO-Capture-Doc-e1591535465631.png" alt="" width="200" height="auto"></img></div>
    
    <div style={{height:"auto", padding:"50px",margin:"auto",display:"flex",flexDirection:"column",textAlign:"center",}}>

    {keyLogo}
      <h3 style={{color:"#0243cd"}}>
        
        Votre mot de passe à été modifié avec succès!
      </h3>

      <p style={{width:"45%",margin:"auto",marginTop:"50px", fontSize:"17px",color:"#0243cd", fontWeight:"600"}}>
        Maintenant que l'opération s'est terminée, vous pouvez retourner vers la page de connexion et vous connecter à l'aide de votre nouveau mot de passe. 
      </p>
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
  )
}
}
export default PasswordChanged