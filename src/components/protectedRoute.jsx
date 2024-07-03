import React,{useEffect,useState,useContext} from 'react'
import { Navigate,useNavigate } from "react-router-dom";
import {UserContext} from "../App"

import axios from 'axios'

const ProtectedRoute = ({children}) => {
  
    let navigate =useNavigate()
    const {userAuth} = useContext(UserContext);
    const jwt= userAuth.token;
    const [res,setRes]= useState("");
   

//si le token est valable acceder au composant sinon rediriger vers page login
   if(jwt !== "" || !isNaN(userAuth.company) || userAuth.company !== undefined || userAuth.company !== null){
    axios.put(`${process.env.REACT_APP_HOST_VAR}rest/user/valideateJwt/${jwt}`,
    {headers: {"Content-Type": "text/plain"}})
    .then((response) => {
      
       setRes(response.data);
     
    })
   
    }

        if(res === "Jeton invalide" || res === "Jeton expiré") {
           navigate("/")
         }  

         
            return children;
        
          


   
       
    }

 


export default ProtectedRoute