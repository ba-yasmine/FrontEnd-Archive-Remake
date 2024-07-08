import React,{useContext, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import axios from 'axios'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import {UserContext} from "../App"
import { ProvenanceContext } from './CompanyProvenancesModal';
import { ToastContainer, toast } from 'react-toastify';
import './styleButton.css';



const schema = yup.object({
    adresse: yup.string().min(3,"minimum 3 caracteres").max(100,"maximum 100 caracteres").required(),
  
    
  }).required();
  
const AddProvenance = ({companyId}) => {

    const {userAuth,setUserAuth} = useContext(UserContext);
    const {setRefresh} = useContext(ProvenanceContext);
    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
      });

   const onSubmit = (data) =>{
    axios.post(`${process.env.REACT_APP_HOST_VAR}rest/provenance/add-provenance/${companyId}`,data,{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>
      
      {
        toast('provenance ajoute a cette societe !')
        setRefresh(prev => prev+1)
      }
            
          ).catch((err) => {
            toast('la provenance existe déja');
          })
   }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row style={{display:'flex', alignItems: 'center'}} className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Name
          </Form.Label>
          <Form.Control
          {...register("adresse")}
            className="mb-0"
            id="inlineFormInput"
            placeholder="nom de la provenance"
          />
                  <p style={{color:'rgb(222, 78,78)'}}>{errors.adresse?.message}</p>
        </Col>
          <div className="buttonStyle">
              <Button type="submit"  style={{ color: 'white', width:'130px'}} className="btn-addprovenance">
                Ajouter
              </Button>
          </div>
           <hr />

      </Row>
    </Form>

  )
}

export default AddProvenance