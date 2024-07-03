import React,{useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../../App"
const GelerUser = ({email}) => {

    const [show, setShow] = useState(false);
    const [pass,setpass] = useState("")
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const [res,setRes] = useState({status:"", message:""})
   


    //recupere le nouveau mot de passe ,l'email et envoie au serveur
    const change = () => {
      
      let object={
      
        password:pass,
        email:email
        

     }
      axios.put(`${process.env.REACT_APP_HOST_VAR}rest/user/changePassword`,object,{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{ 
        
          setRes({status:response.status,message:response.data.message})
           }
          )
      
  }


    

  return (
    <div style={{marginLeft:"10px" ,height:"44px"}}>
        <Button style={{height:"44px", backgroundColor:"#0243cd"}} onClick={handleShow} variant="primary" >
          Changer mot de passe
      </Button> 
      <Modal show={show}  onHide={()=>{handleClose(); setRes("")}}>
        {res.message === "Mot de passe a été changé avec succès"  ? 
         <Alert variant="success">
         <Alert.Heading style={{textAlign:"center",fontSize:"18px"}}>Mot de passe mis à jour avec succés</Alert.Heading>
       </Alert>  : res.message === "User doesn't exists" ? <Alert variant="danger">
         <Alert.Heading style={{textAlign:"center",fontSize:"18px"}}>Cet utilisateur n'existe pas</Alert.Heading> 
       </Alert> : <p></p>
      
      }
        <Modal.Header closeButton>
          <Modal.Title>Changer mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>étes-vous sur de vouloir changer le mot de passe de cet utilisateur?</Modal.Body>
        <Form style={{margin:"15px"}}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control required onChange={e=>setpass(e.target.value)} type="password" placeholder="Entrez le nouveau mot de passe" />
      </Form.Group>
        </Form>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{handleClose(); setRes("")}}>
            Annuler
          </Button>
          <Button style={{backgroundColor:"#0243cd"}} variant="primary" onClick={change}>
            Changer le mot de passe
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default GelerUser