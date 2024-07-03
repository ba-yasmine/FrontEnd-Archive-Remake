import React,{useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../App"

const FinDeTraitementDuLot = ({IdLot}) => {

    const [show, setShow] = useState(false);

    const handleClose = () => {setShow(false); window.location.reload(false);}
    const handleShow = () => setShow(true);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const [res,setRes] = useState({ message:"",status:""})
   

    const Geler = () => {
  
      axios.post(`${process.env.REACT_APP_HOST_VAR}rest/batches/finDeTraitement/${IdLot}`,{},{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>
             {setRes({status:response.status,message:response.data.message})}
          )
      
  }


    

  return (
    <div style={{marginLeft:"10px" ,height:"44px"}}>
        <Button style={{height:"44px" , width:"100%",backgroundColor:"#0243cd"}} onClick={handleShow} variant="primary" >
        Fin de traitement
      </Button> 
      <Modal show={show}   onHide={()=>{handleClose(); setRes("")}}>
      
        <Modal.Header closeButton>
          <Modal.Title style={{color:"#0243cd"}}>Fin de traitement du lot :</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:"17px"}}>Etes-vous sur de vouloir confirmer la fin de traitement de ce lot ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{handleClose(); setRes("")}}>
            Fermer
          </Button>
          {(res.message === "" && res.status === "") ?  <Button style={{backgroundColor:"#0243cd"}} variant="primary" onClick={Geler}>
            Confirmer
          </Button> : res.message === "Fin de traitement du lot" ? <Alert style={{height:"38px", display: "flex", justifyContent:"center", alignItems:"center", margin:"0px",backgroundColor:"green", color:"white"}} variant="success">
        Fin de traitement du lot confirmée
       </Alert> : (res.status === 403 || res.status === 404 ) ?<Alert style={{height:"38px", display: "flex", justifyContent:"center", alignItems:"center", margin:"0px",backgroundColor:"#cd3c31", color:"white"}} variant="success">
        Echec de la mise à jour du lot
       </Alert> : <p></p> }
          
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default FinDeTraitementDuLot