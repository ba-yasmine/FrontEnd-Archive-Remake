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
import AddWareHouse from "./AddEntrepot"



export const EntrepotContext = createContext();

const WareHousesModal = ({companyId}) => {

    const [show, setShow] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [entrepot, setentrepot] =useState([]);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const [entrepotList, SetEntrepotList]= useState([])

    const handleAddentrepot = (newentrepot) => {
      setentrepot([...entrepot, newentrepot]);
    };


    useEffect(()=>{
      show &&  axios.get(`${process.env.REACT_APP_HOST_VAR}rest/entrepot/getAllEntrepot`,{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{

        SetEntrepotList(response.data)
       
      }
     
      
          ).catch((err) => {
          
            
          })
     },[show,refresh])
    
    
     
  return (
   <>
      <Button style={{backgroundColor:'#0243cd', }} onClick={handleShow}>
        Gérer les entrepôts
      </Button>

      <Modal style={{color:"#0243cd"}}  show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Liste des entrepôts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EntrepotContext.Provider value={{setRefresh}}>
              <AddWareHouse onAddentrepot={handleAddentrepot} />
          </EntrepotContext.Provider>
         <hr />
        <ListGroup style={{overflowY: 'scroll'}}  as="ol" numbered>
     { entrepotList.length > 0 ?  entrepotList?.map((el,id)=> {
      return    <ListGroup.Item
      style={{color:"#0243cd"}}
      as="li"
      className="d-flex justify-content-between align-items-start"
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">{el.name} </div>
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

export default WareHousesModal