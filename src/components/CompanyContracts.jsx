import React, { useState,useEffect,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from "axios";
import {UserContext} from "../App"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

const CompanyContracts = ({company}) => {
    const [show, setShow] = useState(false);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [dateDebut,setDateDebut] = useState(new Date());
    const [dateFin,setDateFin] = useState(new Date());
    const [nombreBoites,setNombreBoites] = useState(0);
    const [companie,setCompany] = useState([]);
    const [companie1,setCompany1] = useState([]);
    useEffect(() => {
      
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getOneCompanies/${company.id}`,{ headers:{
        'Authorization': "Bearer" + userAuth.token
      }})
      .then((response) =>{setCompany(response.data);
     
           }
          )
    },[companie1])
   

    const addContractToCompany=() => {

        let date1=new Date(dateDebut).getTime();
        let date2=new Date(dateFin).getTime();
    
  if(companie.contracts?.length > 0){
  
  if( companie.contracts[companie.contracts.length - 1].statut === "Actif"){
    toast('Un contrat est déja en cours pour cette société');
    return;
  }
}
       if(nombreBoites !== 0){
        if(date1<date2 )
        {
            let Contract= {
                "dateDeCreation":dateDebut,
                "dateExpiration":dateFin,
                "nombreBoites":nombreBoites,
               }
          
                axios.post(`${process.env.REACT_APP_HOST_VAR}rest/contrats/addContract/${company.id}`,Contract,{ headers:{
                  'Authorization':  "Bearer" + userAuth.token
                }})
                .then((response) =>{
                  toast(response.data.message)
                  setCompany1([])
                
                     }
                    )
        }

        else{
            toast('Dates entrées invalides');
        }
       }

       
   
    }
    return (
      <>
        <Button style={{backgroundColor:"#0243cd", color: "white", borderRadius:"15px"}}  onClick={handleShow}>
          Contrats
        </Button>
  
        <Modal style={{color:"#0243cd"}} size="xl" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Contrats de la société {company.nomSociete} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
<h4 style={{marginTop:"30px", marginBottom:"30px"}}>Ajouter un contrat: </h4>
<InputGroup className="mb-3" style={{display:"flex", flexWrap: "wrap"}}>
       <input type="date"  style={{border:"1px solid #dee2e6"}}
         onChange={e=> setDateDebut(e.target.value)}
          placeholder="saisir date debut"
          aria-label="saisir nom société"
          aria-describedby="basic-addon2"
        />
        
        <input type="date" style={{border:"1px solid #dee2e6"}}
         onChange={e=> setDateFin(e.target.value)}
          placeholder="saisir date fin"
          aria-label="saisir adresse société"
          aria-describedby="basic-addon2"
        />

      <Form.Control
         onChange={e=> setNombreBoites(e.target.value)}
          placeholder="saisir nombre de boites"
          aria-label="saisir adresse société"
          aria-describedby="basic-addon2"
        />
        <Button onClick={(e)=> {addContractToCompany();  }} style={{backgroundColor:"#0243cd", color: "white"}}  id="button-addon2">
        Ajouter
        </Button>
      </InputGroup>

      <h4 style={{marginTop:"30px", marginBottom:"30px"}}>Liste des contrats: </h4>
          <Table striped responsive  hover size="sm" style={{color:"#0243cd"}}>
      <thead>
        <tr>
          <th>Date de debut</th>
          <th>Date de fin</th>
          <th>Nombre de boites minimal</th>
          <th>Nombre additionnel</th>
          <th>Nombre actuel</th>
          <th>Statut</th>
       
        </tr>
      </thead>
      <tbody>
        {companie !== undefined && companie?.length > 0 ? companie.map((el,idx) => {
        
        return(
        <tr id={idx}>
             <td>{el.dateDeCreation}</td>
             <td>{el.dateExpiration}</td>
             <td>{el.nombreBoites}</td>
             <td>{el.boitesSupplementaires}</td>
             <td>{el.nombreAtteint}</td>
             <td>{el.statut === "Actif" ? <p style={{color: "green", fontWeight:"bold"}}>Actif</p> : <p style={{color: "red", fontWeight:"bold"}}>Expiré</p>} </td>
             
        </tr>
        )

        }) : <p>Aucun contrat trouvé</p>}
       
      </tbody>
    </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
           
          </Modal.Footer>
        </Modal>
      </>
    );
  
}

export default CompanyContracts