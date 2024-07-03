import { useState,useEffect,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {MdOutlineWarehouse} from "react-icons/md"
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import {CiDeliveryTruck} from 'react-icons/ci'
import axios from 'axios'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {UserContext} from "../App"
import ListGroup from 'react-bootstrap/ListGroup';
import {CgProfile} from "react-icons/cg"
import {AiOutlineSelect} from "react-icons/ai"
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  firstname: yup.string().required("Le nom est requis"),
  lastname: yup.string().required("Le prenom est requis"),
  phoneNumber: yup.string()
  .matches(/^(05|06|07)[0-9]{8}$/, "format invalide")
  .required("Le numero de telephone  est requis"),
  email: yup.string().required("L'email est requis"),
});

function Example({ batchId}) {



  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [transporteursList,setTransporteursList] = useState([]);
  const [transporteur,setTransporteur] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const choose =<AiOutlineSelect/>
  useEffect(() => {

    show === true && axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getTransporters`,{headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{
    
       setTransporteursList(response.data)
    }
        ).catch((err) => {
     
         
        })
  }, [show])
  
const assignTransportor=() => {
  setLoading(true)
  axios.put(`${process.env.REACT_APP_HOST_VAR}rest/batches/fixTransportor/${batchId.id}/${transporteur.id}`,{},{headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{
    
      toast.success(response.data.message)
      setTimeout(() => {
        window.location.reload()
      }, 3000);
      axios({
        url: `${process.env.REACT_APP_HOST_VAR}rest/batches/word/${batchId.id}`, //your url
        method: 'GET',
        responseType: 'blob',
        headers:{'Authorization': "Bearer" + userAuth.token}
        // important
    }).then((response) => {
 
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);
    
        // create "a" HTLM element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'Transfert_de_responsabilité' + batchId.id + '.pdf' ); //or any other extension
        document.body.appendChild(link);
        link.click();
    
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        
    }).catch()
  }
      ).catch((err) => {
 
        toast.error(err.response.data.message)
      })
}
const onSubmit = (data) => {
  data.roles = [{id:5  ,name: "ROLE_TRANSPORTEUR"}]
  data.password = "testpassword"
  data.name = data.firstname
  setLoading(true)
  axios.post(`${process.env.REACT_APP_HOST_VAR}rest/user/createUser`,data,{ headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{ 
       setLoading(false);
    
      setLoading(true)
  axios.put(`${process.env.REACT_APP_HOST_VAR}rest/batches/fixTransportor/${batchId.id}/${response.data.message}`,{},{headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{

      toast.success(response.data.message)
      setTimeout(() => {
        window.location.reload()
      }, 3000);
   
  }
      ).catch((err) => {
        setLoading(false)
        toast.error(err.response.data.message)
      })

       }
      ).catch((err) => {
        setLoading(false)
        toast.error(err.response.data.message)
      })

}

  return (
    <>
      <Button style={{backgroundColor: 'white', border:'none'}} onClick={handleShow}>
       <CiDeliveryTruck style={{fontSize:'30px', color:'#0243cd'}}/>
      </Button>

      <Modal style={{color:'#0243cd'}} show={show} onHide={handleClose}>
      <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        <Modal.Header closeButton>
          <Modal.Title> Confirmation de redirection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <FloatingLabel controlId="floatingSelect" label="Selectionnez un transporteur">
      <Form.Select aria-label="Floating label select example"
        onChange={(e) =>{setTransporteur(JSON.parse(e.target.value))
       } }
      >
        <option value="">Choisir un transporteur</option>
       {transporteursList && transporteursList.length > 0 && transporteursList.map((el,id) =>{

          return  <option key={id} value={JSON.stringify(el)} >Nom: {el.firstname} |  Prénom: {el.lastname}</option>
       })}
      </Form.Select>
    </FloatingLabel>
          </Form>
<br />
          <Card>
      <Card.Header style={{color:'#0243cd'}} as="h5">Informations du transporteur</Card.Header>
      <Card.Body>

        {transporteur === null ? 
        
        <div>
         <h6 style={{textAlign: 'center'}}>Ajouter un nouveau transporteur</h6>
         <Form  onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Prénom</Form.Label>
        <Form.Control   {...register('firstname', { required: true })} type="text" placeholder="Saisir prénom" />
        <p style={{color:'red'}}>{errors.firstname?.message}</p>
      </Form.Group>
     < Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Nom</Form.Label>
        <Form.Control  {...register('lastname', { required: true })} type="text" placeholder="Saisir Nom" />
        <p style={{color:'red'}}>{errors.lastname?.message}</p>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Email</Form.Label>
        <Form.Control  {...register('email', { required: true })} type="email" placeholder="example@mail.com" />
        <p style={{color:'red'}}>{errors.email?.message}</p>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Téléphone</Form.Label>
        <Form.Control  {...register('phoneNumber', { required: true })}  type="text" placeholder="0xxxxxxxxx" />
        <p style={{color:'red'}}>{errors.phoneNumber?.message}</p>
      </Form.Group>
     
      <Button  
      disabled={isLoading}
        
           style={{backgroundColor:'white',border:"2px solid #e5e7eb", color:'#0243cd', fontWeight:"600"}}   type="submit">
        Enregister et affecter
      </Button>
    </Form>

        </div> : 

        <div style={{display:'flex',justifyContent: 'space-between',color:'#0243cd', }}>
       <ListGroup variant="flush" style={{width:"60%",}}>
      <ListGroup.Item style={{display:'flex', flexDirection:'row', gap:'5px',padding:"3px",color:'#0243cd',}}> <p style={{fontWeight:"600"}}>Nom:</p> <p>{transporteur?.firstname}</p> </ListGroup.Item>
     <ListGroup.Item style={{display:'flex', flexDirection:'row', gap:'5px',padding:"3px",color:'#0243cd',}}><p style={{fontWeight:"600"}}>Prénom:</p>{transporteur?.lastname}</ListGroup.Item>
     <ListGroup.Item style={{display:'flex', flexDirection:'row', gap:'5px',padding:"3px",color:'#0243cd',}}><p style={{fontWeight:"600"}}>Pseudo:</p>{transporteur?.name}</ListGroup.Item>
     <ListGroup.Item style={{display:'flex', flexDirection:'row', gap:'5px',padding:"3px",color:'#0243cd',}}><p style={{fontWeight:"600"}}>Email:</p> {transporteur?.email}</ListGroup.Item>
     <ListGroup.Item style={{display:'flex', flexDirection:'row', gap:'5px',padding:"3px",color:'#0243cd',}}><p style={{fontWeight:"600"}}>Téléphone:</p> {transporteur?.phoneNumber}</ListGroup.Item>
    </ListGroup>
    <div style={{backgroundColor:'white',border:"2px solid #e5e7eb", width:"30%", maxHeight:'100%',padding:"10px", borderRadius:"10px",display:"flex",justifyContent:"space-between",flexDirection:'column',alignItems:'center'}}>
      <CgProfile style={{fontSize:'60px', color:'#0243cd', }}/>
      <Button 
         disabled={isLoading}
         onClick={!isLoading ? assignTransportor : null}
      style={{backgroundColor:'white',border:"2px solid #e5e7eb", color:'#0243cd', fontWeight:"600"}} > {isLoading === false ? 'affecter' : ''} {isLoading ? 'chargement...' :  choose }  </Button>
    
    </div>
    </div>
    }
       
    
      </Card.Body>
    </Card>
        </Modal.Body>
       
      </Modal>
    </>
  );
}

export default Example;