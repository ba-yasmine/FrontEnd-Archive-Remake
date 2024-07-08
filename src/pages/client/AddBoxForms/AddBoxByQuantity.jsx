import React,{useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import {UserContext} from "../../../App"
const schema = yup.object().shape({

    provenance: yup.string().required(),
    nbrBoites: yup.number().min(1).max(2000).required("nombre de boites entre 1 et 2000"),
  });

const AddBoxByQuantity = () => {


    const [isLoading, setLoading] = useState(false);
    const [provenance, setprovenance] =useState([]);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const { register, handleSubmit,watch, formState:{ errors } } = useForm({
      resolver: yupResolver(schema)
    });

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${userAuth.company}`,{headers:{
            'Authorization':  "Bearer" + userAuth.token
          }})
          .then((response) =>{
     
           setprovenance(response.data)
          }
          
              ).catch((err) => {
           
                
              })
    },[])

    const onSubmit =(data) => {
        setLoading(true)
        console.log(data.provenance)
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/batches/createAddBoxBatch/${userAuth.company}/${userAuth.ID}/${data.provenance}/${data.nbrBoites}`,{},{ headers:{
            'Authorization':  "Bearer" + userAuth.token
          }})
            .then((response) =>{
            console.log(response.data.message)
              toast.success(response.data.message)
        
              setTimeout(() => {
               window.location.reload()
              }, 3000);
        
                 }
                ).catch(e =>{
                  toast.success(e.data.message)
        
                })
           
    }

  return (
    <div> <Form
    disabled={isLoading}
    onSubmit={!isLoading ? handleSubmit(onSubmit) : null}
    >
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
    
    <Form.Group className="mb-3" controlId="formBasicEmail">
     <br />
      <Form.Label>Provenance:</Form.Label>
     <br />
     <FloatingLabel controlId="floatingSelect" label="Choisir une provenance">
    <Form.Select  {...register('provenance', { required: true })} aria-label="Floating label select example">
      <option>Choisir une option</option>
     {provenance?.map((el,id)=>{
      
      return <option key={id} value={el.id}>{el.adresse}</option>
     })
     }
    </Form.Select>
  </FloatingLabel>
  <p style={{color:'rgb(222, 78,78)'}}>{errors.provenance?.message ? "veuillez selectionner une provenance": ""}</p>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Nombre de boites: </Form.Label>
      <Form.Control  {...register('nbrBoites', { required: true })} type="text" placeholder="..100" />
    </Form.Group>
    <p style={{color:'rgb(222, 78,78)'}}>{errors.nbrBoites?.message ? "Veuillez saisier le nombre de boite": ""}</p>
   <br />
    <Button
       
    style={{backgroundColor:'#0243cd'}} type="submit">
      Confirmer
    </Button>
  </Form></div>
  )
}

export default AddBoxByQuantity