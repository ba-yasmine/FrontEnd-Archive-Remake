import React,{useEffect,useState,useContext} from 'react'
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddBoxByQuantityForm  from "./AddBoxForms/AddBoxByQuantity"
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Containerbox from '../../components/ContainerBox'
import { useParams } from "react-router-dom";
import { faBan} from '@fortawesome/free-solid-svg-icons'
import {UserContext} from "../../App"
import "../Administrateur/style.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {headerTitleContext} from '../../Layout/layout'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BsFillFileEarmarkExcelFill} from "react-icons/bs";
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
  axios({
    url: `${process.env.REACT_APP_HOST_VAR}rest/batches/downloadTemplate/${userAuth.company}`, //your url
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


  //selectionner le fichier en entrée
 
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getDepartements/${userAuth.ID}`,{ headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{setDepartementList(response.data); })

    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${userAuth.company}`,{headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{
   
     setprovenance(response.data)
     selectedProvenance2(response.data[0].id)

    }
   
        ).catch((err) => {
  
          
        })
  },[])

  const onSubmit = (data) => {
    setLoading(true)
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
          Company:userAuth.company,
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

  
   //test
  return (
    <div  >
  
        <main  >
      
    
        <Tabs
      defaultActiveKey="profile"
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="home" title="Ajout quantitatif"  >
      <div class='formAdd'  id="lists" style={{margin:"auto", marginTop:"45px",width:"25%" , padding:'10px' , borderRadius:"5px", border :'2px solid #e5e7eb ', }}>
        <Card.Title style={{color:'#0243cd'}} >Créez votre lot</Card.Title>
         <AddBoxByQuantityForm/>
         
        </div>

      </Tab>
      <Tab eventKey="profile" title="Ajout par fichier Excel">
      
      <div id="lists" class='formAdd' style={{margin:"auto", marginTop:"45px",width:"25%" , padding:'10px' , borderRadius:"5px", border :'2px solid #e5e7eb ', }}>
        <Card.Title style={{color:'#0243cd'}} >Créez votre lot</Card.Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
        <br />
        <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Importer le modèle: </Form.Label>
       
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
      <p style={{color:'rgb(222, 78,78)'}}>{errors.provenance?.message ? "veuillez selectionner une provenance": ""}</p>
    </FloatingLabel>
      
      </Form.Group>
   
     
     <Form.Group className="mb-3"  controlId="formBasicPassword">
        <Form.Label>Modèle remplit: </Form.Label>
        <br />
        <Form.Control required style={{ height:"50px", backgroundColor:"#e9ecef"}}   type="file"  placeholder="importer fichier"   {...register('file', { required: true })} />  
        <p style={{color:'rgb(222, 78,78)'}}>{errors.file?.message ? "veuillez selectionner un fichiers": ""}</p>
      </Form.Group>
     
     <br />
     <div className="buttonStyle">
         <Button
              disabled={isLoading}
              type="submit"
             style={{marginLeft:"15px" }} >
              {isLoading ? 'chargement...' : "confirmer"}
         </Button>
     </div>
    </Form>
         
        </div>
      </Tab>
      <Tab eventKey="longer-tab" title="Ajout manuel" style={{padding:'20px'}}>
      <div style={{display: 'flex', flexDirection: 'column' , alignItems:'center'}}>
    <br />
      <div style={{display: 'flex', justifyContent:'space-between',width:'100%' }}>
      <FloatingLabel controlId="floatingSelect" label="Choisir une provenance" style={{width:"220px", marginBottom:"4px"}}>
      <Form.Select onChange={(e)=>selectedProvenance2(e.target.value) } defaultValue={selectedProventreetrance}   aria-label="Floating label select example">
      <option>choisir une option</option>
     {provenance?.map((el,id)=>{
      
      return <option key={id} value={el.id}>{el.adresse}</option>
     })
     }
      </Form.Select>
    
    </FloatingLabel>
      </div>
      <br />
      <Containerbox style={{margin:'auto'}} Donnes={arrAddBox} provenance={selectedProventreetrance}/>
      
      </div>
      </Tab>
      
    </Tabs>
   
    </main>

  </div>
    
  )
}

export default AddBox