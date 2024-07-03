import React,{useEffect,useState,useContext} from 'react'
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddBoxByQuantityForm  from "./../../client/AddBoxForms/AddBoxByQuantity"
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Containerbox from '../../../components/ContainerBox'
import { useParams } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { faAdd,faFileExcel ,faBan} from '@fortawesome/free-solid-svg-icons'
import {UserContext} from "../../../App"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {headerTitleContext} from '../../../Layout/layout'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BsFillFileEarmarkExcelFill} from "react-icons/bs";
import BatchInitForm from "./batchForm"
import { FaExchangeAlt} from "react-icons/fa";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';


const schema = yup.object().shape({
  file: yup.mixed()
  .required('Un fichier est requis.'),
  provenance: yup.string().required("Provenance is required"),

});


const AddBox = () => {


  const { register,handleSubmit,  formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [isLoading, setLoading] = useState(false);
  const [datePickDelivery, setdatePickDelivery] = useState(Date);
  const [company, setcompany] = useState();
  const [step, setStep] = useState(0);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [provenance, setprovenance] =useState([]);
  const [selectedProventreetrance, selectedProvenance2] = useState();
  const [msg,setmsg] = useState({
    status:"",
    message:""
  })

  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
    const [arrAddBox,setArrAddBox] = useState([{id:0,state:"new",  description:"",company:{id:""},departements:{ id:"", nom:""}}])
    
    const forbidden =<FontAwesomeIcon style={{ color:"#0243cd",marginRight:"20px",marginTop:"200px",marginBottom:"50px"}} size="4x" icon={faBan}/>
    const [selectedFile, setSelectedFile] = React.useState(null);
    
    let params= useParams();
    const [departementList,setDepartementList] = useState([])
  
    
    useEffect(() => {
      setheaderTitle('Demande Add-Boxes')
      setheaderArrow(true)
    })
  
//telecharger le modèle a remplire
const DownloadTemp= ()=> {
  console.log(company + "uiiii")
  axios({
    url: `${process.env.REACT_APP_HOST_VAR}rest/batches/downloadTemplate/${company}`, //your url
    method: 'GET',
    responseType: 'blob',
    headers:{ 'Content-Type' : 'multipart/form-data','Authorization': "Bearer" + userAuth.token}
    // important
}).then((response) => {
    // create file link in browser's memory
    const href = URL.createObjectURL(response.data);

    // create "a" HTLM element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', 'Modèle_a_remplir.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(`${process.env.REACT_APP_HOST_VAR}rest/batches/downloadTemplate`,);
});
  
 }
    
 
//envoyer fichier excel au serveur
const onSubmit = (data) => {
   


  setLoading(true);
  if (data.file[0].size > 1048576) {
    toast("Le fichier est trop volumineux !");
    return;
  }
  
  const formData = new FormData();
  formData.append('file', data.file[0]);
  axios.post(
    `${process.env.REACT_APP_HOST_VAR}rest/batches/importData`,formData,
    
    {
      params: {
        provenance: data.provenance,
        Company:company,
        Issuer: userAuth.ID

      },
      headers:{ 'Content-Type': 'multipart/form-data;' ,'Authorization': "Bearer" + userAuth.token}
    }
  ).then(response => {
    toast.success(response.data.message)
    setTimeout(() => {
      window.location.reload()
    }, 3000);
  }).catch(error => {
    toast.error(error.response.data.message)
  });

}


  //selectionner le fichier en entrée
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }

  useEffect(() => {
    if(company !== undefined){
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getDepartements/${company}`,{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{setDepartementList(response.data); })
    
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${company}`,{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{
     
       setprovenance(response.data)
       selectedProvenance2(response.data[0].id)
  
      }
     
          ).catch((err) => {
    
            
          })
    }
    
  },[company])

  const handleChildStateChange = (childState) => {
    setStep(childState);
  };
  const handleCompanyState = (company) => {
    setcompany(company);
  };
  const handleDateState = (date) => {
    setdatePickDelivery(date);
  };
  

  if (step === 0){
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <BatchInitForm onStateChange={handleChildStateChange} onCompanyChange={handleCompanyState} onDateChange={handleDateState}/>
    </div>
  }


  if(departementList.length === 0){
    return (
      <div >

       <main style={{display: 'flex', flexDirection:"column", alignItems: 'center',height:"100%",marginTop:"30px",width:"97%",marginLeft:"auto",marginRight:"auto", backgroundColor:"white", paddingTop:"50px",borderRadius:"5px", }}>
       {forbidden}
       <h5 id="headers" style={{textAlign:"center",color:"#0243cd",margin:"0 auto"}}> Impossible d'ajouter des boites car aucun département ne vous a été attribué</h5>
       </main>
      </div>
    )

  
  }

  
        
  return (
    <div  >
  
        <main  >
        <div style={{padding:'20px' }}>
           <Button style={{ backgroundColor:'#0243cd'}} onClick={()=> setStep(0)}><FaExchangeAlt style={{color:"white"}}/> modifier la societe</Button>
       </div>
    <hr />
        <Tabs
      defaultActiveKey="profile"
      id="justify-tab-example"
      className="mb-3"
      justify
    >

      <Tab eventKey="profile" title="Ajout par fichier Excel">
      <div class='formAdd' style={{margin:"auto", marginTop:"45px",width:"25%" , padding:'10px' , borderRadius:"5px", border :'2px solid #e5e7eb ', }}>
        <Card.Title style={{color:'#0243cd'}} >Creez votre lot</Card.Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
        <br />
        <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Importer le modele: </Form.Label>
       
        <Button onClick={() => DownloadTemp()} style={{ backgroundColor:"white",  border:'none'}}  {...register('provenance', { required: true })}  > <BsFillFileEarmarkExcelFill style={{ color:'#0243cd', fontSize:'30px' }}/></Button>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
      <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
        <Form.Label>Provenance:</Form.Label>
       <br />
       <FloatingLabel controlId="floatingSelect" label="Choisir une provenance">
      <Form.Select {...register('provenance', { required: true })}  aria-label="Floating label select example">
          <option>choisir une option</option>
     {provenance?.map((el,id)=>{
      
      return <option key={id} value={el.id}>{el.adresse}</option>
     })
     }
      </Form.Select>
      <p style={{color:'red'}}>{errors.provenance?.message ? "veuillez selectionner une provenance": ""}</p>
    </FloatingLabel>
      
      </Form.Group>
   
     
     <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Modele remplit: </Form.Label>
        <br />
        <Form.Control required style={{ height:"50px", backgroundColor:"#e9ecef"}}   type="file"  placeholder="importer fichier"   {...register('file', { required: true })} />  
        <p style={{color:'red'}}>{errors.file?.message ? "veuillez selectionner un fichiers": ""}</p>
      </Form.Group>
     
     <br />
     <Button 
          disabled={isLoading}
          type="submit"
         style={{marginLeft:"15px" ,backgroundColor:"#0243cd"}} >
          {isLoading ? 'chargement...' : "confirmer"}
         </Button>
    </Form>
        </div>
      </Tab>
      <Tab eventKey="longer-tab" title="Ajout manuelle" style={{padding:'20px'}}>
      <div style={{display: 'flex', flexDirection: 'column' , alignItems:'center'}}>
    <br />
      <div style={{display: 'flex', justifyContent:'space-between',width:'100%' }}>
      <FloatingLabel   controlId="floatingSelect" label="Choisir une provenance">
      <Form.Select onChange={(e)=>selectedProvenance2(e.target.value) } defaultValue={selectedProventreetrance} aria-label="Floating label select example">
      <option>choisir une option</option>
     {provenance?.map((el,id)=>{
      
      return <option key={id} value={el.id}>{el.adresse}</option>
     })
     }
      </Form.Select>
    </FloatingLabel>
      </div>
      <br />
      <Containerbox style={{margin:'auto'}} Donnes={arrAddBox} provenance={selectedProventreetrance} company={company} datePickup={datePickDelivery}/>
      
      </div>
      </Tab>
      
    </Tabs>
   
    </main>

  </div>
    
  )
}

export default AddBox