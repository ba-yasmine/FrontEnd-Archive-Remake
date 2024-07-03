import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../App';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  company: yup.string().required('Champ obligatoire'),
  deliveryDate: yup.date(),
  numberOfBoxes: yup.number().when('batchType', {
    is: 'Add_Box',
    then: yup.number().required(),
  }),
});

const BatchForm = ({ batchType, onStateChange ,onCompanyChange, onDateChange}) => {
  const { userAuth } = useContext(UserContext);
  const [companies, setCompanies] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`, {
        headers: {
          Authorization: 'Bearer' + userAuth.token,
        },
      })
      .then((response) => {
        setCompanies(response.data);
      });
  }, [userAuth.token]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
  
    onStateChange(1)
    onCompanyChange(data.company)
    onDateChange(data.deliveryDate)
    
  };

  return (
    <div>
      <Form
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #e5e7eb',
          borderRadius: '5px',
          padding: '20px',
        
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4 style={{ color: '#0243cd' }}>Initier un lot</h4>
        <hr />
        <div style={{display: 'flex', justifyContent: 'space-around',  gap:"20px"}}>   
        
        <div style={{border:"1px solid #0243cd", borderRadius:"5px", padding:"15px", width:"55%"}}>
        <p style={{color:"#0243cd", fontWeight:"600"}}>Demandeur:</p>
          <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label style={{color:"#0243cd"}} >Nom:</Form.Label>
        <Form.Control type="text" placeholder="saisir nom" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label style={{color:"#0243cd"}}>Prenom:</Form.Label>
        <Form.Control type="text" placeholder="saisir prenom" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label style={{color:"#0243cd"}}>Telephone:</Form.Label>
        <Form.Control type="text" placeholder="saisir num tel" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label style={{color:"#0243cd"}}>Email:</Form.Label>
        <Form.Control type="email" placeholder="saisir adresse mail" />
      </Form.Group>
        </div>
         <div>
        <FloatingLabel controlId="floatingSelect" label="Selectionnez une société">
          <Form.Select aria-label="Floating label select example" {...register('company')}>
            <option >Société: Tous</option>
            {companies?.map((el) => (
              <option key={el.id} value={el.id}>
                Société: {el.nomSociete}
              </option>
            ))}
          </Form.Select>
          {errors.company && <span className="text-danger">{errors.company.message}</span>}
        </FloatingLabel>
        <br />
        <Form.Group className="mb-3" controlId="deliveryDate">
          <Form.Label>Date de livraison du lot:</Form.Label>
          <Form.Control type="datetime-local" placeholder="name@example.com" {...register('deliveryDate')} />
          {errors.deliveryDate && <span className="text-danger">{errors.deliveryDate.message}</span>}
        </Form.Group>
        {batchType === 'Add_Box' ? (
          <Form.Group className="mb-3" controlId="numberOfBoxes">
            <Form.Label>Nombre de boites du lot:</Form.Label>
            <Form.Control type="number" placeholder="saisir le nombre de boites" {...register('numberOfBoxes')} />
            {errors.numberOfBoxes && <span className="text-danger">{errors.numberOfBoxes.message}</span>}
          </Form.Group>
        ) : (
          <></>
        )}
          <Button style={{ float: 'left', backgroundColor: '#0243cd', width: '100px' }} type="submit" variant="primary">
          confirmer
        </Button>
        </div>
        
       
        </div>
    
        
        <hr />
     
      
      </Form>
    </div>
  );
};

export default BatchForm;
