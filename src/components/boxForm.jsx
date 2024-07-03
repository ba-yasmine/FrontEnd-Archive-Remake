
import Form from 'react-bootstrap/Form';
import React,{useEffect,useState,useContext}from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {AiFillEdit} from "react-icons/ai"
import {GrStatusGood}  from "react-icons/gr"
import axios from 'axios'
import {UserContext} from "../App"
import * as yup from "yup";
import { useForm, useController } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';

const schema = yup.object({
    description: yup.string().min(3,"minimum 3 caracteres").max(100,"maximum 300 caracteres").required(),
    departement: yup.number().required("nombre > 1")  
  }).required();

const FormComponent = ({departementList, el, onRefresh}) => {

    const {userAuth,setUserAuth} = useContext(UserContext);
    const {register,  handleSubmit,formState:{ errors } } = useForm({
      resolver: yupResolver(schema),
    });
  

  


    const onSubmit = (data) => {
        
        const box ={id: el.id, description: data.description, departements:{id: data.departement}}
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/boxes/completeBox`,box,{ headers:{
            'Authorization':  "Bearer" + userAuth.token
          }})
          .then((response) =>{
           
               toast.success(response.data.message)
               onRefresh(prev => prev +1)
               }
              ).catch((e) => {
                toast.error(e.response.data.message)
              })
      
    };
  
    return (
        <Form onSubmit={handleSubmit(onSubmit)} style={{border:"2px solid #0243cd",padding:"20px",borderRadius:"5px",color:"#0243cd",width:"100%",}}>
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        <h4>Boite N° {el.id}</h4>
        <Form.Group required className="mb-3" >
        <Form.Label>Description</Form.Label>
        <textarea   {...register("description")}  maxlength="100"  class="form-control"  type="text" required placeholder="Saisir une description"  ></textarea>
        <p style={{color:'red'}}>{errors.description?.message}</p>
        </Form.Group>
      
        <Form.Group  className="mb-3" controlId="formBasicEmail">
      <Form.Label>Département</Form.Label>
      <Form.Select  {...register("departement")}  aria-label="Default select FillBtach">
  <option value=''>Tous</option>
  {departementList?.map(el => (
    <option value={el.id}>{el.nom}</option>
  ))}
 
</Form.Select>
<p style={{color:'red'}}>{errors.departement?.message}</p>

    </Form.Group>
    <Button type="submit" style={{backgroundColor:"#0243cd"}}>
       confirmer
     </Button>
        </Form>
    );
  };
  
  export default FormComponent