import React,{useEffect,useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../../App"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { FiEdit} from "react-icons/fi";

const Modifier = ({boite}) => {

  const schema = yup.object().shape({
    id: yup.string().default(boite.id).required(),
    description: yup.string().required("Description is required"),
    company: yup.string().required(),
    geolocalisation: yup.string().required("Geolocalisation is required"),
    codeBarre: yup.string()
    .matches(/^[A-Z]{2}-\d{6}$/, "Invalid format: Expected 2 capital letters, a hyphen, and 6 digits")
    .min(9).max(9).required("Codebarre is required"),
    departements: yup.string().required("Departements is required"),
    provenance: yup.string().required("Provenance is required"),
    location: yup.string().required("location is required"),
  });
  
  const [formObject, setFormObject] = useState(null);
  const { register, handleSubmit,watch, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handleChange = () => {
    const currentFormValues = watch(); // get current form values
    setFormObject(currentFormValues);
   
  };

    const [show, setShow] = useState(false);

    const handleClose = () => {setShow(false); setDisplayDeps(false)  }
    const handleShow = () => setShow(true);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const [description,setDescription] = useState("")
    const [company,setCompany] = useState({id:"", nomSociété:""})
    const [geoloc,setGeoloc] = useState("")
    const [location,setLocation] = useState("Emplacement")
    const [departement,setDepartement] = useState([])
    const [année,setAnnee] = useState("")
    const [Choosendepartement,setChoosenDepartement] = useState()
    const [codebarre,setCodebarre] = useState("")
    const [companies,setCompanies] = useState([])
    const [displayDeps,setDisplayDeps] = useState(false)
    const [companyId,setCompanyId] = useState(2)
    const [disableBTN,setDisableBTN] = useState(false)
    const [provenance, setprovenance] =useState([]);
    const [res,setRes] = useState({
      status:"",
      message:""
    })
   

//recharger la page si l'operation est un succes 

useEffect(() => {
 
  show && axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getDepartements/${companyId}`,{headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{
  
   setDepartement(response.data)
    setChoosenDepartement(response.data[0].id)
  }
 
      ).catch((err) => {
      
        
      })

show && axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${companyId}`,{headers:{
  'Authorization':  "Bearer" + userAuth.token
}})
.then((response) =>{
 
 setprovenance(response.data)
}

    ).catch((err) => {
 
      
    })
      
},[companyId])

 useEffect(() => {

  



  axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`,{ headers:{
    'Authorization': "Bearer" +  userAuth.token
  }})
  .then((response) =>{
    setCompanies(response.data);
    setCompany({id:response.data[0].id, nomSociete:response.data[0].nomSociete})
    
    })

      
  
  if(res.message !== undefined) { 
         
        if(res.message.includes("enregistrée avec succes"))
        {
        
          setShow(false); 
          document.location.reload();
     
        }

      }
     
      else {return;}
   }, [res]);



//soumettre le formulaire et envoyer object au serveur    
const onSubmit = (data) => {

  data['company'] = {id :data['company'] }
  data['provenance'] = {id :data['provenance'] }
  data['departements'] = {id :data['departements'] }
  setDisableBTN(true)

  axios.put(`${process.env.REACT_APP_HOST_VAR}rest/boxes/updateBox`,data,{ headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{ 
  
    toast.success(response.data.message)
    setDisableBTN(false)
    setTimeout(() => {
      handleClose();
      window.location.reload()
    }, 3000); // change the timeout as per your preference
  }).catch((e) =>{
    setDisableBTN(true)
    toast.error(e.response.data.message)
  });
}

  return (
    <div style={{  }}>
        <Button  style={{background:'none',border:'none'}} onClick={handleShow}>
        <FiEdit style={{fontSize:'30px', color:'#0243cd'}}/>
      </Button> 
      <Modal size="lg"   show={show} onHide={()=>{handleClose(); setRes("")}}>
      <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        <Modal.Header closeButton>
          <Modal.Title>Modifier la boite {boite.codeBarre} </Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <Form style={{display: 'flex', justifyContent: 'center',alignItems: 'center',gap:"50px"}} onSubmit={handleSubmit(onSubmit)}>

          <div style={{width:"50%"}}>

      <Form.Group className="mb-3" required controlId="formBasicEmail">
        <Form.Label>Description de la boite</Form.Label>
        <Form.Control
        required 
        as="textarea"
        maxlength="100" 
        defaultValue={boite.description}
        {...register('description', { required: true })}
        onChange={handleChange}
         style={{color:"#0243cd"}} 
        />
     <p style={{color:'red'}}>{errors.description?.message}</p>
     
         <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Société</Form.Label>
        <Form.Select  {...register('company', { required: true })} 
        onChange={(e)=> {setCompanyId(e.target.value);}}
        defaultValue={boite?.company?.id} 
          aria-label="Default select example">
        <option>Open this select menu</option>
        {companies?.map((el,id) => (
        <option key={id} value={el.id} >Société: {el.nomSociete}</option>
      ))}
    </Form.Select>
    <p style={{color:'red'}}>{errors.company?.message ? "veuillez selectionner une société": ""}</p>
      </Form.Group>

      <Form.Group className="mb-3" required controlId="formBasicEmail">
      <Form.Label>Emplacement: </Form.Label>
      <Form.Select   defaultValue={boite.location}  {...register('location', { required: true })}  aria-label="Default select example">
      <option>Open this select menu</option>
      <option value="At_Warehouse">Entrepot</option>
      <option value="At_Customer">Client</option>
      <option value="Pending">En attente</option>
      <option value="In_Transit">En transit</option>
    </Form.Select>
    <p style={{color:'red'}}>{errors.location?.message}</p>
        
      </Form.Group>

      </Form.Group>
      </div>
      <div  style={{width:"50%"}}> 
      

    
         <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Département:</Form.Label>
    <div>
        <Form.Select  defaultValue={boite.departements?.id}  {...register('departements', { required: true })} aria-label="Default select example">
        <option>choisir une option</option>
     {departement?.map((el,id)=>{
      
      return <option key={id} value={el.id}>{el.nom}</option>
     })
     }
      
    </Form.Select>
    <p style={{color:'red'}}>{errors.departements?.message ? "veuillez selectionner un département": ""}</p>
      </div>
      
      </Form.Group>


       <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Provenance:</Form.Label>

       <div>
        <Form.Select   defaultValue={boite.provenance?.id}  {...register('provenance', { required: true })} aria-label="Default select example">
        <option>choisir une option</option>
     {provenance?.map((el,id)=>{
      
      return <option key={id} value={el.id}>{el.adresse}</option>
     })
     }
      
    </Form.Select>
    <p style={{color:'red'}}>{errors.provenance?.message ? "veuillez selectionner une provenance": ""}</p>
      </div>  
    
  
      
      
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Géolocalisation </Form.Label>
        <Form.Control   defaultValue={boite.geolocalisation} maxlength="20"  onChange={handleChange} {...register('geolocalisation', { required: true })} type="text" placeholder="Enter geoloc." />
       <p style={{color:'red'}}>{errors.geolocalisation?.message}</p>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Code à barre</Form.Label>
        <Form.Control  onChange={handleChange}  defaultValue={boite.codeBarre}  maxlength="30" {...register('codeBarre', { required: true })} type="text" placeholder="Entrer code-barre" />
        <p style={{color:'red'}}>{errors.codeBarre?.message}</p>
      </Form.Group>

      <Button style={{backgroundColor:"#0243cd"}} disabled={disableBTN} variant="primary" type="submit">
       {disableBTN ? "Patientez..." : "confirmer"} 
      </Button>
    
      </div>
      </Form>
      
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{handleClose(); setRes("")}}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
        
    </div>
  )
}

export default Modifier