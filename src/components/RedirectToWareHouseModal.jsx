import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {MdOutlineWarehouse} from "react-icons/md"
import { useState,useEffect,useContext } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import {UserContext} from "../App"

function RedirectToWareHouse({ batchId}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);

  const assignWareHouse=() => {


   setLoading(true)
    axios.put(`${process.env.REACT_APP_HOST_VAR}rest/batches/assignWarehouse/${batchId.id}`,{},{headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{
      console.log()
        toast.success(response.data.message)
        setTimeout(() => {
          window.location.reload()
        }, 3000);
    }
        ).catch((err) => {
          toast.error(err.response.data.message)
        })
  }
  

  return (
    <>
      <Button style={{backgroundColor: 'white', border:'none'}} onClick={handleShow}>
       <MdOutlineWarehouse style={{fontSize:'30px', color:'#0243cd'}}/>
      </Button>

      <Modal show={show} onHide={handleClose}>
      <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        <Modal.Header closeButton>
          <Modal.Title> Confirmation de redirection</Modal.Title>
        </Modal.Header>
        <Modal.Body>Le lot {batchId.id} va etre redirigé vers son entrepot</Modal.Body>
        <Modal.Footer>
         
          <Button 
           disabled={isLoading}
           onClick={!isLoading ? assignWareHouse : null}
          
          style={{backgroundColor:'#0243cd'}}  >
             {isLoading ? 'chargement...' : 'confirmer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RedirectToWareHouse;