import React from 'react';
import { Form } from 'react-bootstrap';

const CommuneSelect = ({ communes , onChange  , register , errors}) => (
    <Form.Group className="mb-3">
  <Form.Label>Commune: </Form.Label>
  <Form.Select  {...register('communeId')}  onChange={onChange} className="form-control">
    <option value="">Select Commune</option>
    {communes.map(commune => (
      <option key={commune.commune_id} value={commune.commune_id}>
        {commune.designation_fr}
      </option>
    ))}
  </Form.Select>
  <p style={{ color: 'red' }}>{errors.communeId?.message}</p>
  </Form.Group>
);

<<<<<<< HEAD
export default CommuneSelect;
=======
export default CommuneSelect;
>>>>>>> origin/main
