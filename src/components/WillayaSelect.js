import React from 'react';
import { Form } from 'react-bootstrap';

const WillayaSelect = ({ willayas, onChange, register, errors}) => (
    <Form.Group className='mb-4'>
    <Form.Label >Wilaya: </Form.Label>
    <Form.Select

      {...register('willayaId')}
      className='form-control'
      onChange={onChange}
      >
      <option value="">Choisir Wilaya</option>
      {willayas.map(willaya => (
        <option key={willaya.willayaId} value={willaya.willayaId}>
          {willaya.willayaDesignationFr}
        </option>
      ))}
    </Form.Select>
    <p style={{color: 'rgb(222, 78,78)'}}>{errors.willayaId?.message}</p>
    </Form.Group>
  );

  export default WillayaSelect;
