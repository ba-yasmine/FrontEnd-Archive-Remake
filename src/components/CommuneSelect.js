import React from 'react';
import { Form } from 'react-bootstrap';

const CommuneSelect = ({ communes , onChange  , register , errors}) => (
    <Form.Group className="mb-4">
  <Form.Label>Commune: </Form.Label>
  <Form.Select  {...register('communeId')}  onChange={onChange} className="form-control">
    <option value="">Choisir Commune</option>
    {communes.map(commune => (
      <option key={commune.commune_id} value={commune.commune_id}>
        {commune.designation_fr}
      </option>
    ))}
  </Form.Select>
  <p style={{ color: 'rgb(222, 78,78)' }}>{errors.communeId?.message}</p>
  </Form.Group>
);

export default CommuneSelect;
