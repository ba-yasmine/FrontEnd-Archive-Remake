import React, { useState,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../../App"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import {PanierRequest} from "./box-request"
import Card from 'react-bootstrap/Card';
import {TiDeleteOutline} from 'react-icons/ti'

function PanierBoxRequest({provenanceId}) {

 
  const {selectionRequest,setSelectionRequest} = useContext(PanierRequest);
    const [lgShow, setLgShow] = useState(false);
    const [count, setPanier] = useState(0);
    const handleClose = () => {setLgShow(false); window.location.reload()}
    const handleShow = () => setLgShow(true);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const element = <FontAwesomeIcon size="lg" style={{color:"#CB1C06"}} icon={faTrash}/>
    const cartIco = <FontAwesomeIcon size="lg" style={{color:"white"}} icon={faCartShopping}/>
    const [isLoading, setLoading] = useState(false);
    const [msg,setmsg] = useState({
      status:"",
      message:""
    })
   

   
//envoyer les boites selectionnées
    const sendRequ=() => {
       
          setLoading(true)
          axios.post(`${process.env.REACT_APP_HOST_VAR}rest/batches/createBatch/Box_Request/${userAuth.company}/${userAuth.ID}/${provenanceId}/${null}`,selectionRequest,{ headers:{
            'Authorization':  "Bearer" + userAuth.token
          }},
         )
          .then((response) =>{
            toast.success(response.data.message)
            setTimeout(() =>{window.location.reload();},3000)
                         
      }).catch((error) =>{
        toast.error(error)
      })
      }
 

  return (
    <>
     
      <Button style={{backgroundColor:"rgb(2, 67, 205)" , color:"white", width:'auto', }} onClick={() => setLgShow(true)}>{selectionRequest.length} boites {cartIco}</Button>
      <Modal
       style={{color:"rgb(2, 67, 205)",overflowY:"auto", maxHeight:"85vh",}}
        size="xl"
        show={lgShow}
        onHide={() => {setLgShow(false); /*document.location.reload()*/}}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        {selectionRequest.length === 0  ?  <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Veuillez d'abord sélectionner une ou plusieurs boites
          </Modal.Title>
        </Modal.Header> : 
        <div>
         <Modal.Header closeButton>
         <Modal.Title id="example-modal-sizes-title-lg">
           Panier des boites
         </Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <Container style={{display:"grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", width:'100%'}}>
          
       {  selectionRequest.map((el,idx) => {

return ( 
  <Card 
  bg={'light'}
  key={idx}

  text={'#0243cd'}
  style={{ width: '98%', }}
  className="mb-2"
>
<Card.Header  style={{display:"flex", justifyContent:"space-between", alignItems: 'center'}}> <h6>Boite {el?.codeBarre}</h6>    <h6>{el.departements.nom}</h6>  </Card.Header>

  <Card.Body >
    
  <h6 style={{}}> Description : </h6>
    <div style={{ display:"flex", justifyContent: 'space-between',alignItems: 'center'}}>
  
    <Card.Text style={{width:"85%", }}>
     {el.description}
    </Card.Text>
   
   
  
    
    <button style={{float: 'right', border:"none", background:"none", color:"#0243cd",width:"15px",margin:"auto"}} onClick={()=>{let key= el.id ; setSelectionRequest(selectionRequest.filter(el =>  el.id !== key));}} ><TiDeleteOutline style={{fontSize:"35px"}}/></button>
    </div>
    
  </Card.Body>
  <Card.Footer>
          <small >Provenance: {el.provenance.adresse}</small>
        </Card.Footer>
  <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
  
</Card>

)
})

}
         </Container>
       </Modal.Body>
       <Modal.Footer>
      
       

         <div>
         <Button variant="secondary" onClick={handleClose}>
         Fermer
       </Button>
       <Button 
          
          disabled={isLoading}
          onClick={!isLoading ? sendRequ : null}
         
         
         style={{marginLeft:"15px" ,backgroundColor:"#0243cd"}} >
          {isLoading ? 'chargement...' : "Confirmer l'envoi"}
         </Button> </div>
       
      
        
       </Modal.Footer>
       </div>
        }
       
      </Modal>
    </>
  );
}
export default PanierBoxRequest