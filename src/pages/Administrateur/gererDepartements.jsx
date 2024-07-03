import React, { useState,useEffect,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from "axios";
import {UserContext} from "../../App"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const UserDepartements = ({user}) => {
    const [show, setShow] = useState(false);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const handleClose = () => {setShow(false); document.location.reload();}
    const handleShow = () => setShow(true);
    const [departements,setDepartement]= useState([])
    const [departements1,setDepartement1]= useState([])
    const [Addabledepartements,setAddableDepartement]= useState([])
    const [Choosendepartement,setChoosenDepartement] = useState({id:""})
    const [isLoading, setIsLoading] = useState(false)
    const removeDepIco = <FontAwesomeIcon size="1x" style={{color:"#ffff"}} icon={faXmark}/>
   
   
   useEffect(() => {
      let userId=user.id

      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getDepartements/${userId}`,{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{setDepartement(response.data); })


      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getAddeableEmployeDepartements/${userId}`,{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{
        if(response.data[0]){

        
        setAddableDepartement(response.data);
         setChoosenDepartement(response.data[0].id)
        }
      }
        );
      

    },[departements1]);
   

    const addDepartement=(departement) => {
         
        let userId = user.id;
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/departements/Eadd-departement/${departement}/${userId}`,{},{ headers:{
          'Authorization':  "Bearer" + userAuth.token
        }})
        .then((response) =>{toast(response.data.message)
            setIsLoading(false)
          setDepartement1([])
             
             }
            ).catch((error) =>{})
  
}


const removeDepartement=(departement) => {
      
  let userId = user.id;
  axios.post(`${process.env.REACT_APP_HOST_VAR}rest/user/removeDepartementOfUser/${userId}`,departement,{ headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{
    toast(response.data.message)
      setDepartement1([])
  
       }
      )
}


    
    return (
      <div style={{marginLeft:"10px" ,height:"44px"}}>
        <Button style={{backgroundColor:"#0243cd", color: "white"}}  onClick={handleShow}>
          Gérer départements
        </Button>
  
        <Modal style={{color:"#0243cd"}} size="4x" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Départements de <strong>{user.name}</strong> : </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
<h5 style={{marginTop:"30px", marginBottom:"30px"}}>Affecter un département: </h5>

<Form.Group  className="mb-3" controlId="formBasicEmail">
        
       {Addabledepartements.length > 0 ? 
                <Form.Select aria-label="Default select example" onChange={(e)=> setChoosenDepartement(e.target.value)}>
                { Addabledepartements?.map((el,id) =>{
                  return <option key={id} value={el.id} >{el.nom}</option>
                }) }
                </Form.Select> :
                <p style={{fontWeight:'600'}}>pas de départements disponibles</p>
      }
    
      </Form.Group>
     
        <Button 
          disabled={Addabledepartements.length === 0 || isLoading === true}
        onClick={(e)=> {addDepartement(Choosendepartement); setIsLoading(true)  }} style={{backgroundColor:"#0243cd", color: "white"}}  id="button-addon2">
         {isLoading ? 'Ajout.....' : 'Ajouter'}
        </Button>
   

      <h5 style={{marginTop:"30px", marginBottom:"30px"}}>Départements de l'utilisateur: </h5>
          <Table striped responsive  hover size="sm" style={{color:"#0243cd"}}>
      <thead>
        <tr>
          <th>Nom département</th>
          <th>retirer</th>
        </tr>
      </thead>
      <tbody>
        {(departements !== null && departements.length > 0)? departements.map((el,idx) => {
        
        return(
        <tr id={idx}>
             <td>{el.nom}</td>
             <td><Button variant="danger" onClick={() => {removeDepartement(el)}} >{removeDepIco}</Button></td>
        </tr>
        )

        }) : <p>Aucun département trouvé</p>}
       
      </tbody>
    </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
           
          </Modal.Footer>
        </Modal>
        </div>
    );
  
}

export default UserDepartements