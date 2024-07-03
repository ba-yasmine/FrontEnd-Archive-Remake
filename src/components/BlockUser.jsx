import React,{useEffect,useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../App"
const BlockUser = ({id,status}) => {

    const [show, setShow] = useState(false);
    const [pass,setpass] = useState("")
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const [res,setRes] = useState({status:"", message:""})
   


    //recupere le nouveau mot de passe ,l'email et envoie au serveur
    const change = () => {
      
      let object={
      
        id:id
        

     }
      axios.put(`${process.env.REACT_APP_HOST_VAR}rest/user/BlockUnblockUser`,object,{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{ 
       
          setRes({status:response.status,message:response.data.message})
          if(response.data.message === "Utilisateur bloqué avec succès" || response.data.message === "Utilisateur débloqué avec succès"){
            setShow(false);
            document.location.reload(); 
         }
           }
          )
      
  }


    

  return (
    <div style={{marginLeft:"10px" ,height:"44px"}}>
        <Button style={{height:"44px", backgroundColor:"#0243cd"}} onClick={handleShow} variant="primary" >
           {status === "AUTHORIZED" ? "Bloquer l'utilisateur" : "Debloquer l'utilisateur"} 
      </Button> 
      <Modal show={show}  onHide={()=>{handleClose(); setRes("")}}>
        {res.message === "Utilisateur bloqué avec succès" || res.message === "Utilisateur débloqué avec succès"? 
         <Alert variant="success">
         <Alert.Heading style={{textAlign:"center",fontSize:"18px"}}>{res.message}</Alert.Heading>
       </Alert>  : res.message === "User doesn't exists" ? <Alert variant="danger">
         <Alert.Heading style={{textAlign:"center",fontSize:"18px"}}>Cet utilisateur n'existe pas</Alert.Heading> 
       </Alert> : <p></p>
      
      }
        <Modal.Header closeButton>
          <Modal.Title>{status === "AUTHORIZED" ? "Bloquage" : "Débloquage"} utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>Etes-vous sur de vouloir {status === "AUTHORIZED" ? "bloquer" : "débloquer "}cet utilisateur?</Modal.Body>
       
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{handleClose(); setRes("")}}>
            Fermer
          </Button>
          <Button style={{backgroundColor:"#0243cd"}} variant="primary" onClick={change}>
          {status === "AUTHORIZED" ? "Bloquer" : "Débloquer "}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default BlockUser