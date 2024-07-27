import React, { useState, useEffect, useContext, createContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { UserContext } from "../App";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddDepartement from './AddDepartement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import NoResult from './noResultsFound';
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';
import './styleButton.css';

export const DepartementContext = createContext();

const CompanyDepartement = ({ companyId }) => {
  const [show, setShow] = useState(false);
  const [refreshDepartements, setRefreshDepartements] = useState(0);
  const [departements, setDepartements] = useState([]);
  const { userAuth } = useContext(UserContext);
  const removeDepIco = <FontAwesomeIcon size="1x" style={{ color: "#ffff" }} icon={faXmark} />;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getDepartements/${companyId.id}`, {
        headers: {
          'Authorization': "Bearer " + userAuth.token
        }
      })
        .then((response) => {
          setDepartements(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [show, refreshDepartements, companyId.id, userAuth.token]);

 const removeDepartement = (departementId) => {

  console.log(companyId);
  console.log(departementId);


    axios.post(`${process.env.REACT_APP_HOST_VAR}rest/departements/removeDepartementOfCompany/${companyId.id}`,{ id: departementId}, {
      headers: {
        'Authorization': `Bearer ${userAuth.token}`
      }
    }
  )
    .then((response) => {
        //toast("Département supprimé avec succès");
        setRefreshDepartements(prev => prev + 1);
    })
    .catch((err) => {
        toast(err.response?.data?.message || 'Erreur lors de la suppression du département');
    });
};

  return (
    <>
      <div className="buttonStyle">
          <Button onClick={handleShow}>
            Départements
          </Button>
      </div>

      <Modal style={{ color: "#0243cd" }} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Liste des départements de {companyId.nomSociete}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DepartementContext.Provider value={{ setRefreshDepartements }}>
            <AddDepartement companyId={companyId.id} />
          </DepartementContext.Provider>

          <hr />
          <h6 style={{ marginTop: "30px", marginBottom: "20px" , fontWeight: 'bold'}}>Départements de l'utilisateur </h6>

          <Table striped responsive hover size="sm" style={{ color: "#0243cd" }}>
            <thead>
              <tr>
                <th>Nom département</th>
                <th>Retirer</th>
              </tr>
            </thead>
            <tbody>
              {departements.length > 0 ? departements.map((el, id) => (
                <tr key={id} >
                      <td>{el.nom}</td>
                      <td><Button variant="danger" onClick={() => removeDepartement(el.id)}>{removeDepIco}</Button></td>
                </tr>
              )) : <tr><td colSpan="2">Aucun département trouvé</td></tr>}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        color="green"
      />
    </>
  );
}

export default CompanyDepartement;
