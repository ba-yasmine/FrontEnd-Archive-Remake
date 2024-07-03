import React from 'react';
import { Form } from 'react-bootstrap';

<<<<<<< HEAD
const WillayaSelect = ({ willayas, onChange, register, errors}) => (
    <Form.Group className='mb-2'>
    <Form.Label >Wilaya: </Form.Label>
    <Form.Select 
     
      {...register('willayaId')}
      className='form-control'
      onChange={onChange}
      >
      <option value="">Select Wilaya</option>
=======

const WillayaSelect = ({ willayas, onChange , register , errors }) => (
  <Form.Group className="mb-3">
    <Form.Label>Willaya:</Form.Label>
    <Form.Select
      {...register('willayaId')}
      className="form-control"
      onChange={onChange}
    >
      <option value="">Select Willaya</option>
>>>>>>> origin/main
      {willayas.map(willaya => (
        <option key={willaya.willayaId} value={willaya.willayaId}>
          {willaya.willayaDesignationFr}
        </option>
      ))}
    </Form.Select>
<<<<<<< HEAD
    <p style={{color: 'red'}}>{errors.willayaId?.message}</p>
    </Form.Group>
  );
  
  export default WillayaSelect;
=======
    <p style={{ color: 'red' }}>{errors.willayaId?.message}</p>
  </Form.Group>
);

export default WillayaSelect;
>>>>>>> origin/main
