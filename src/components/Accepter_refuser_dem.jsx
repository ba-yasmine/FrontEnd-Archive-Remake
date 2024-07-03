import React,{useEffect,useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {UserContext} from "../App"


const ARDEM = ({data,type}) => {

    const [show, setShow] = useState(false);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const handleClose = () => {setShow(false); window.location.reload(false);}
    const handleShow = () => setShow(true);
    const [res,setRes] = useState({ message:"",status:""})
    

    const Geler = () => {
      
      axios.post(`${process.env.REACT_APP_HOST_VAR}rest/batches/accepterOuRefuser/${data.id}/${type}`,{},{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{setRes({status:response.status,message:response.data.message})
          
           }
          )
      
  }


    

  return (
    <div style={{marginLeft:"10px" ,height:"44px"}}>
        <Button style={{height:"44px" , width:"100%",backgroundColor:"#0243cd"}} onClick={handleShow} variant="primary" >
        {type === "Accepter" ? "accepter" : "refuser"}
      </Button> 
      <Modal show={show}   onHide={()=>{handleClose(); setRes("")}}>
      
        <Modal.Header closeButton>
          <Modal.Title style={{color:"#0243cd"}}>Traitement du lot :</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:"17px"}}>Etes-vous sur de vouloir {type === "Accepter" ? "accepter ce lot ?" : "refuser ce lot ?"} </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{handleClose(); setRes("")}}>
            Fermer
          </Button>
          {(res.message === "" && res.status === "") ?  <Button style={{backgroundColor:"#0243cd"}} variant="primary" onClick={Geler}>
            {type === "Accepter" ? "accepter" : "refuser"}
          </Button> : (res.message === "Le lot accepté" || res.message === "Le lot a été décliné") ? <Alert style={{height:"38px", display: "flex", justifyContent:"center", alignItems:"center", margin:"0px",backgroundColor:"green", color:"white"}} variant="success">
        
      Le lot a été {type === "Accepter" ? "accepté avec succès" : "refusé"}
    </Alert> : (res.message === 'wrong parameters' || res.status === 403 || res.status === 404) ?<Alert style={{height:"38px", display: "flex", justifyContent:"center", alignItems:"center", margin:"0px",backgroundColor:"#cd3c31", color:"white"}}  variant="danger">
   
       échec {type === "Accepter" ? "de l'acceptation" : "du refus"} du lot
    </Alert> : <p></p> }
          
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ARDEM