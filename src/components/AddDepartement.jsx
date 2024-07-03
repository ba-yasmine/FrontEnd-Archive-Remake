import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { UserContext } from "../App";
import { DepartementContext } from './CompanyDepartementsModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WillayaSelect from './WillayaSelect';
import CommuneSelect from './CommuneSelect';

const AddDepartement = ({ companyId }) => {
    
    const [refresh, setRefresh] = useState(0);
    const [departementList, setDepartementList] = useState([]);
    const [addedDepartements, setAddedDepartements] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState('');
    const [departement, setDepartement] = useState('');
    const [newDepartementName, setNewDepartementName] = useState('');
    const { userAuth } = useContext(UserContext);
    const { setRefreshDepartements } = useContext(DepartementContext);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getAddeableDepartements/${companyId}`, {
            headers: {
                'Authorization': "Bearer " + userAuth.token
            }
        })
        .then((response) => {
            setDepartementList(response.data);
            if (response.data.length > 0) {
                setDepartement(response.data[0].id);
            }
        })
        .catch((err) => {
            console.error(err);
        });

        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getDepartements/${companyId}`, {
            headers: {
                'Authorization': "Bearer " + userAuth.token
            }
        })
        .then((response) => {
            setAddedDepartements(response.data);
        })
        .catch((err) => {
            console.error(err);
        });

    }, [refresh, companyId, userAuth.token]);

    const onSubmit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/departements/add-departement/${departement}/${companyId}`, {}, {
            headers: {
                'Authorization': "Bearer " + userAuth.token
            }
        })
        .then((response) => {
            setRefresh(prev => prev + 1);
            toast('Département ajouté à cette société !');
            setRefreshDepartements(prev => prev + 1);
        })
        .catch((err) => {
            toast(err.response?.data?.message || 'Erreur lors de l\'ajout du département');
        });
    };

    const addNewDepartement = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/departements/add/${companyId}`, { nom: newDepartementName }, {
            headers: {
                'Authorization': "Bearer " + userAuth.token
            }
        })
        .then((response) => {
            setRefresh(prev => prev + 1);
            toast('Nouveau département ajouté à cette société avec succès !');
            setNewDepartementName('');
            setAddedDepartements(prev => [...prev, response.data]); // Add the new department to the added list
            setRefreshDepartements(prev => prev + 1);
        })
        .catch((err) => {
            toast(err.response?.data?.message || 'Erreur lors de l\'ajout du nouveau département');
        });
    };

    const handleChangeDeparetement = (dep) =>{
        console.log(userAuth.token)
        setSelectedDepartement(dep)
        setDepartement(dep)
    }



    return (
        <div>
           
            <Form onSubmit={(e) => onSubmit(e)}>
                {departementList.length === 0 ? <p>Pas de départements disponibles à ajouter.</p> :
                    <Row className="align-items-center mb-3">
                        <Col xs="auto">
                            <Form.Label>Départements disponibles</Form.Label>
                            <Form.Select 
                                value={selectedDepartement}
                                onChange={(e) => { handleChangeDeparetement(e.target.value) }} 
                                style={{ color: '#0243cd' }} 
                                aria-label="Default select example"
                            >
                                {departementList?.map((el, id) => {
                                    return <option key={id} value={el.id}>{el.nom}</option>;
                                })}
                            </Form.Select>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit" style={{ marginTop: '30px', backgroundColor: '#0243cd', color: 'white' , width:110}}>
                                Ajouter
                            </Button>
                        </Col>
                    </Row>
                }
            </Form>
            <Form onSubmit={addNewDepartement}>
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            value={newDepartementName}
                            onChange={(e) => setNewDepartementName(e.target.value)}
                            placeholder=""
                            required
                            style={{ marginBottom: '10px', width: 260 }}
                            minLength={5} 
                            maxLength={50}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit" style={{ marginBottom: '10px', backgroundColor: '#0243cd', color: 'white', width:110 }}>
                            + Nouveau 
                        </Button>
                    </Col>
                </Row>
            </Form>
          {/* <h5 style={{ marginTop: "30px", marginBottom: "30px" }}>Départements de l'utilisateur: </h5> */}
           
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default AddDepartement;