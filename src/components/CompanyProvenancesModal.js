import React, { useState, useEffect, useContext, createContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import {UserContext} from "../App"
import axios from 'axios'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import NoResult from './noResultsFound'
import AddProvenance from './AddProvenance'


const schema = yup.object({
  adresse: yup.string().min(3,"minimum 3 caracteres").max(100,"maximum 100 caracteres").required(),
  
  
}).required();

export const ProvenanceContext = createContext();

const CompanyProvenanceModal = ({companyId}) => {

    const [show, setShow] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [provenance, setprovenance] =useState([]);
    const {userAuth,setUserAuth} = useContext(UserContext);

    const handleAddProvenance = (newProvenance) => {
      setprovenance([...provenance, newProvenance]);
    };


    useEffect(()=>{
      show && axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${companyId}`,{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{
     
       setprovenance(response.data)
      }
     
          ).catch((err) => {
          
            
          })
     },[show,refresh])
    
    
     
  return (
   <>
      <Button style={{backgroundColor:'#0243cd'}} onClick={handleShow}>
        Provenances
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#0243cd'}}>Provenances de Ooredoo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProvenanceContext.Provider value={{setRefresh}}>
          <AddProvenance companyId={companyId} onAddProvenance={handleAddProvenance} />
          </ProvenanceContext.Provider>
         
        <ListGroup as="ol" numbered>
     { provenance.length > 0 ?  provenance?.map((el,id)=> {
      return    <ListGroup.Item
      style={{color:'#0243cd'}}
      as="li"
      className="d-flex justify-content-between align-items-start"
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold"></div>
        {el.adresse}
      </div>
      
    </ListGroup.Item>
     }) : <NoResult/>}
     
   
    
    </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          Fermer
          </Button>
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CompanyProvenanceModal