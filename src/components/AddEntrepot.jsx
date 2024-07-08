import React,{useContext, useState} from 'react'
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
import { EntrepotContext } from './ManageWareHouses';
import { ToastContainer, toast } from 'react-toastify';
import './styleButton.css';



const schema = yup.object({
    name: yup.string().min(3,"minimum 3 caractères").max(30,"maximum 30 caracteres").required(),
    adresse: yup.string().min(3,"minimum 3 caractères").max(100,"maximum 100 caracteres").required(),
  
    
  }).required();
  
const AddEntrepot = ({}) => {


    const [disableBTN,setDisableBTN] = useState(false)
    const {userAuth,setUserAuth} = useContext(UserContext);
    const {setRefresh} = useContext(EntrepotContext);
    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
      });

   const onSubmit = (data) =>{
    setDisableBTN(true);
    axios.post(`${process.env.REACT_APP_HOST_VAR}rest/entrepot/add-entrepot`,data,{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>
      
      {
        setDisableBTN(false)
        toast.success(response.data.message)
        setRefresh(prev => prev+1)
      }
            
          ).catch((err) => {
            setDisableBTN(false)
            toast.error(err.response.data.message);
          })
   }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Nom
          </Form.Label>
          <Form.Control
          {...register("name")}
            className="mb-2"
            id="inlineFormInput"
            placeholder="Nom "
          />
                  <p style={{color:'rgb(222, 78,78)' , marginLeft:"40px"}}>{errors.name?.message}</p>
        </Col>
        <Col xs="auto">
          <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Adresse
          </Form.Label>
          <Form.Control
          {...register("adresse")}
            className="mb-2"
            id="inlineFormInput"
            placeholder="Adresse "
          />
                  <p style={{color:'rgb(222, 78,78)', marginLeft:"40px"}}>{errors.adresse?.message}</p>
        </Col>

        <Col xs="auto">
          <div className="buttonStyle">
              <Button type="submit" disabled={disableBTN}  style={{ color: 'white', width:"385px",border:"2px solid #e5e7eb"}} className="mb-2">
              {disableBTN ? "Patientez..." : "Ajouter"}
              </Button>
          </div>
        </Col>

      </Row>

    </Form>

  )
}

export default AddEntrepot