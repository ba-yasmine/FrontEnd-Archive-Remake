import React, { useState,useEffect,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from "axios";
import {UserContext} from "../../App"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { BiHistory} from "react-icons/bi";
const BoxHistory = ({boxInfos}) => {
    const [show, setShow] = useState(false);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const handleClose = () => {setShow(false);}
    const [HistoryMap,setHistoryMap] = useState([])
    const handleShow = () => 
    {
        setShow(true);
        
        let id=boxInfos.id;
        
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/boxes/getHistory/${id}`,{
          headers:{ 'Authorization': "Bearer" + userAuth.token}
        })
        .then((response) =>{setHistoryMap(response.data);   })

    }

    
    
    const history = <FontAwesomeIcon icon={faClockRotateLeft} size="1x" style={{color:"#0243cd"}}/>

   
    
   

  
    
    return (
      <div style={{marginLeft:"10px" ,height:"44px"}}>
        <Button style={{border:"none", background:"none"}}  onClick={handleShow}>
        <BiHistory style={{fontSize:'30px', color:'#0243cd'}}/>
        </Button>
  
        <Modal style={{color:"#0243cd"}} size="4x" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Historique de la boite  : </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />



      <h5 style={{marginTop:"30px", marginBottom:"30px"}}>Table des historiques: </h5>
         

       {HistoryMap.length === 0 ? <strong  style={{textAlign:"center"}}>Pas d'historique</strong> : 
       
       <Table striped responsive  hover size="sm" style={{color:"#0243cd"}}>
       <thead>
         <tr>
           <th>Type de demande:</th>
           <th>Date:</th>
           <th>Lot relatif:</th>
         </tr>
       </thead>
       <tbody>

       {HistoryMap.map((el,idx) => {
             return (<tr key={idx}>
                <td>{el.batchType}</td>
                <td>{el.date}</td>
                <td>
                     {userAuth.role[0] === "ROLE_CUSTOMER" ? 
                <Button style={{border:"none", background:"none"}}>
                    <Link style={{ textDecoration:"none", fontWeight:"600",color:'#0243cd' }} to={`/Client/Demandes/demandesLookup/${el.batchId}/${userAuth.company}`}>Accéder</Link>
                </Button> :
                <Button style={{border:"none", background:"none"}}>
                    <Link style={{ textDecoration:"none", fontWeight:"600" , color:'#0243cd' }} to={`/Admin/demandes/${boxInfos.provenance.company.id}/${el.batchId}`}>Accéder</Link>
                </Button>
                     } 
                    </td> 

             </tr>)

       })}

      </tbody>
    </Table>
    }
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

export default BoxHistory