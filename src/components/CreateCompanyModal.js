import React, { useState,useContext, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import {UserContext} from "../App"
import { ToastContainer, toast } from 'react-toastify';
import WillayaSelect from './WillayaSelect';
import CommuneSelect from './CommuneSelect';
import './styleButton.css';


const schema = yup.object({
  nomSociete: yup.string().min(3,"minimum 3 caracteres").max(100,"maximum 100 caracteres").required(),
  siege: yup.string().min(5,"minimum 5 caracteres").max(100,"maximum 100 caracteres").required(),
  contactprincipal: yup.string().min(3, "minimum 3 caracteres").max(100, "maximum 100 caracteres").required(),
  numerotel: yup.string().min(10, "minimum 10 numero").max(20, "maximum 20 caracteres").required(),
  email: yup.string().min(13,"minimum 13 caracteres").max(100,"maximum 100 caracteres").required(),
  willayaId: yup.string().required("Please select a Willaya") ,
  communeId: yup.string().required("Please select a Commune") ,
  codepostale: yup.string().min(2,"minimum 2 caracteres").max(10,"maximum 10 caracteres").required(),
}).required();


function CreateCompanyModal() {

  const [disableBTN,setDisableBTN] = useState(false)
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const handleClose = () => {setShow(false); setStep(1)}
  const handleShow = () => setShow(true);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [entrepotList, SetEntrepotList]= useState([])
  const [entrepot, SetEntrepot]= useState(0)
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

 useEffect(()=>{
  show && axios.get(`${process.env.REACT_APP_HOST_VAR}rest/entrepot/getAllEntrepot`,{headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{

    SetEntrepotList(response.data)
    SetEntrepot(response.data[0].id)
  }


      ).catch((err) => {

          SetEntrepot(err)
      })
 },[show])


 const onSubmit = (data) => {
  console.log("Form data:", data);  // Log the form data to inspect its content
  setDisableBTN(true);

  data.willaya = {"id": selectedWillaya}
  data.commune = {"id": selectedCommune}

     console.log(data)


  axios.post(`${process.env.REACT_APP_HOST_VAR}rest/company/add-company/${entrepot}`, data, {
    headers: { 'Authorization': "Bearer" + userAuth.token }
  })
  .then(response => {
    setDisableBTN(false);
    toast.success('Societe ajoutée !');
    window.location.reload();
  })
  .catch(err => {
    setDisableBTN(false);
    toast.error('la societe existe déja');
  });

};


const [willayas, setWillayas] = useState([]);
  const [selectedWillaya, setSelectedWillaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

    const [communes, setCommunes] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/api/willayas/all`, {
            headers: {
              'Authorization': 'Bearer ' + userAuth.token
            }
          })
          .then(response => setWillayas(response.data))
          .catch(error => console.error('Error fetching initial data:', error));
      }, []);

      const handleWillayaChange = async (e) => {
        const willayaId = e.target.value;
        setSelectedWillaya(willayaId);
        const selectedCommunes = willayas.find(w => w.willayaId === willayaId)?.communes || [];
        setCommunes(selectedCommunes);

      };
      const handleCommuneChange = e => {
        const communeId = e.target.value;
        setSelectedCommune(communeId);
      };


  return (
    <>
     <div className="buttonStyle">
         <Button onClick={handleShow}>
          Ajouter société
          </Button>
     </div>
      <Modal  style={{color:'#0243cd'}} show={show} onHide={handleClose}>
        <Modal.Header className="center" closeButton>
              <Modal.Title >Ajouter une société</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <div>

       <form onSubmit={handleSubmit(onSubmit)}>
       <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Label>Nom société:</Form.Label>
        <Form.Control {...register("nomSociete")} />
        <p style={{color:'red'}}>{errors.nomSociete?.message}</p>
      </Form.Group>


      <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Label>Contact Principal:</Form.Label>
        <Form.Control {...register("contactprincipal")} />
        <p style={{color:'red'}}>{errors.contactprincipal?.message}</p>
      </Form.Group>

      <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control {...register("email")} />
        <p style={{color:'red'}}>{errors.email?.message}</p>
      </Form.Group>

      <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Label>Téléphone:</Form.Label>
        <Form.Control {...register("numerotel")} />
        <p style={{color:'red'}}>{errors.numerotel?.message}</p>
      </Form.Group>

      <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>Adresse: </Form.Label>
          <Form.Control {...register("siege")} />
          <p style={{color:'red'}}>{errors.siege?.message}</p>
      </Form.Group>
      <Form.Group className="mb-4" controlId="adresse">
          <Form.Label>Code Postale:</Form.Label>
          <Form.Control {...register("codepostale")} />
          <p style={{color:'red'}}>{errors.codepostale?.message}</p>
      </Form.Group>


    <WillayaSelect register={register} errors={errors} willayas={willayas} onChange={handleWillayaChange} />
    <CommuneSelect register={register} errors={errors} communes={communes} onChange={handleCommuneChange}/>

    <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label>Entrepôt: </Form.Label>
            <Form.Select required onChange={(e)=> { SetEntrepot(e.target.value)}}   aria-label="Default select example">

              {entrepotList?.map((el,id) =>{
               return  <option key={id} value={el.id}>{el.name}</option>
              })}

        </Form.Select>
      </Form.Group>
      <div className="buttonStyle">
      <Button disabled={disableBTN} style={{width:'83%', float:'right' , margin: '40px', marginTop:"30px", marginBottom:"30px"}} variant="primary" type="submit">
      {disableBTN ? "Patientez..." : "confirmer"}
      </Button>
      </div>
    </form>
    <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            />
        </div>
        </Modal.Body>

        </Modal >
    </>
   )

}

export default CreateCompanyModal;