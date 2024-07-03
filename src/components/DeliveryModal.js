import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function DeliveryModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
       Programmer livraison
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Programmer la livraison du lot BRQ00005</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="DeliveryModalForm.ControlInput1">
              <Form.Label>Email addresse</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@DeliveryModal.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="DeliveryModalForm.ControlTextarea1"
            >
              <Form.Label>DeliveryModal textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Enregistrer les modifications
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeliveryModal