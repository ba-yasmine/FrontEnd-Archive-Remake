import { useState,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios"
import {BsCalendarDate} from 'react-icons/bs'
import {UserContext} from "../App"
import { ToastContainer, toast } from 'react-toastify';

const schema = yup.object().shape({
  dateLivraisonPickup: yup
    .date()
    .min(new Date(), "date choisie invalide")
    .required(),
});
function Example({batchType}) {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);
  
  
  const onSubmit = (data) => {

  setLoading(true)
    axios.post(`${process.env.REACT_APP_HOST_VAR}rest/batches/fixDate/${batchType.id}/${data.dateLivraisonPickup}`,{},{headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{
        toast.success(response.data.message)
            setTimeout(() => {
          window.location.reload()
        }, 3000);
   
       
        
    }
        ).catch((err) => {
   
          toast.error(err.response.data.message)
        })
  };
  
  return (
    <>
      <Button style={{backgroundColor: 'white', border:'none'}}  onClick={handleShow}>
       <BsCalendarDate  style={{fontSize:'30px', color:'#0243cd'}}/> 
      </Button>

      <Modal show={show} onHide={handleClose}>
      <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        <Modal.Header closeButton>
            <Modal.Title>Plannifier {batchType.requestType === 'Box_Request' ? 'la date de livraison' : 'la date de pickup'} du lot {batchType.id} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form   onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
             
              <Form.Group className="mb-3" controlId="deliveryDate">
          <Form.Label>Date de {batchType === 'Box_Request' ? 'Livraison' : 'Pickup'} du lot:</Form.Label>
          <Form.Control type="datetime-local" placeholder="name@example.com" {...register('dateLivraisonPickup')} />
          {errors.dateLivraisonPickup && <span className="text-danger">{'veuillez specifier une date'}</span>}
        </Form.Group>
            </Form.Group>
            <Button 

              disabled={isLoading}
              style={{backgroundColor: '#0243cd'}} type="submit" >
             {isLoading ? 'chargement...' : 'confirmer'}
          </Button>
          </Form>
        </Modal.Body>
       
      </Modal>
    </>
  );
}

export default Example;