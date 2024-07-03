import React, { useState,useContext} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {MdOutlineAutoDelete} from 'react-icons/md'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"
import {UserContext} from "../App"
import Form from 'react-bootstrap/Form';

function ProgramDestruction({batchId}) {
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {userAuth} = useContext(UserContext);
  const [numOfmonths, setNumOfMonths] = useState(0);
   
  const ReportDestroy = (e) =>{
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_HOST_VAR}rest/batches/retardShredding/${batchId.id}/${numOfmonths}`,{},{headers:{
      'Authorization':  "Bearer" + userAuth.token
    }}).then((response) =>{
      toast.success(response.data.message)
          setTimeout(() => {
        window.location.reload()
      }, 3000);
  }
      ).catch((err) => {
        setLoading(false)
        toast.error(err.response.data.message)
      })
  }

  const onSubmit = () => {
  setLoading(true)
  axios.put(`${process.env.REACT_APP_HOST_VAR}rest/batches/assignWarehouse/${batchId.id}`,{},{headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
    .then((response) =>{
        toast.success(response.data.message)
            setTimeout(() => {
          window.location.reload()
        }, 3000);
    }
        ).catch((err) => {
          setLoading(false)
          toast.error(err.response.data.message)
        })
  };

  return (
    <>
      <Button style={{backgroundColor:'white',border:"2px solid #e5e7eb"}}  onClick={handleShow}>
       <MdOutlineAutoDelete style={{fontSize:'30px', color:'#0243cd'}} />
      </Button>

      <Modal show={show} onHide={handleClose}>
      <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        <Modal.Header closeButton>
          <Modal.Title style={{color:"#0243cd"}}>Destruction du lot {batchId.id} </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:"#0243cd"}} >Veuillez confirmer si vous souhaitez procéder à la destruction des boîles du lot ou si vous préférez reporter cette opération:</Modal.Body>
        <Modal.Footer style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <Form onSubmit={(e)=> ReportDestroy(e) } style={{display:"flex",flexDirection:"row",width:"50%"}}>
          <Form.Control type="number" style={{width:"30%"}}  onChange={(e)=> setNumOfMonths(e.target.value)} required placeholder="0" min="0" />
          <Button disabled={isLoading}  type="submit" style={{backgroundColor:'white', color:'#0243cd', fontWeight:"600"}} variant="secondary">
            Reporter
          </Button>
          </Form>
       
          <Button onClick={()=> onSubmit()} disabled={isLoading} style={{backgroundColor:'white',border:"2px solid red", color:'red', fontWeight:"600"}} >
            Confirmer la destruction
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ProgramDestruction