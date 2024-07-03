import React,{useEffect,useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../App"


const AjoutClient = ({email}) => {

    const [show, setShow] = useState(false);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const handleClose = () => {setShow(false);setRes(""); isloading(false)}
    const handleShow = () => setShow(true);
    const [loading,isloading] =useState(false);
    
    const [res,setRes] = useState({
      message:"",
      status:""
    })
   



    //envoie le mail de l'utilisateur qui a perdu son mot de passe au server
    const submit = (e) => {
      isloading(true)
      if(email !== null) {
        
        e.preventDefault();
      
        let object={
           email:email,
         

        }
  
       
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/user/SendNewpassword`,object,{ headers:{
          'Authorization': "Bearer" + userAuth.token
        }})
        .then((response) =>{
            
            setRes({message:response.data.message,status:response.status})
            
             }
            )
        
      }

      else {e.preventDefault()}
     
    }

    
  return (
    <div >
        <Button style={{backgroundColor:"white", border:"none", color:"blue", textAlign:"center", marginTop:"0px", fontSize:"14px", fontWeight:"600"}} variant="primary" onClick={handleShow}>
        Mot de passe oublié?
      </Button> 
      <Modal style={{ color:"#0243cd"}} show={show} onHide={()=>{handleClose(); setRes("")}}>
       

{email === "" ?
    
    <Modal.Body style={{fontWeight:'600'}}>Veuillez d'abord saisir votre mail dans le formulaire</Modal.Body>:
    <div>
       <Modal.Header closeButton>
    <Modal.Title>Changer de mot passe</Modal.Title>
  </Modal.Header>

  <Modal.Body style={{fontSize:"18px"}}>Vous receverez votre nouveau mot de passe par mail:</Modal.Body>
  <Modal.Footer style={{display:"flex", justifyContent: "space-arround" ,alignItems: "center" ,gap:"20px"}}>
    
    {res.message === "Mot de passe envoyé" ?
    <Alert style={{ height:"38px",display: "flex", justifyContent:"center", alignItems:"center", margin:"0px", backgroundColor:"white", color:"green", border:"3px solid green", borderRadius:"5px",}} >
    Veuillez cliquer sur le lien envoyé par mail
  </Alert> : res.message === "User doesn't exists" ?
  <Alert style={{ height:"38px",display: "flex", justifyContent:"center", alignItems:"center", margin:"0px"}} variant="danger">
  Utilisateur innexistent
</Alert> : res.status === 403 || res.status === 404 ?  <Alert style={{ height:"38px",display: "flex", justifyContent:"center", alignItems:"center", margin:"0px"}} variant="danger">
  Erreur d'envoi
</Alert> : <Button style={{backgroundColor:"#0243cd"}} variant="primary" onClick={submit}>
  {loading === true? "Patientez ..." : "Confirmer"}
</Button>
  
  }
    
  </Modal.Footer>
    </div>
   
  
  }

      
        
      </Modal>
   
    </div>
  )
}


export default AjoutClient