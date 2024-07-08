import React,{useEffect,useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../../App"
import { ToastContainer, toast } from 'react-toastify';


const ModifierClient = ({objecto}) => {

  const [show, setShow] = useState(false);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const handleClose = () =>{ setShow(false); setClick(false);  }
  const handleShow = () => setShow(true);
  const [role,setRole] = useState({id:objecto.roles[0].id, name:objecto.roles[0].name})
  const [nomUser,setUser] = useState(objecto.name)
  const [roles,setRoles] = useState([])
  const [email,setEmail] = useState(objecto.email)
  const [phone,setPhone] = useState(objecto.phoneNumber)
  const [firstName,setFirstName] = useState(objecto.firstname)
  const [lastName,setLastName] = useState(objecto.lastname)
  const [company,setCompany] = useState({id:objecto.company?.id, nomSociete:objecto.company?.nomSociete})
  const [companies,setCompanies] = useState([])
  const [departement,setDepartement] = useState(objecto.departement)
  let selectedcompany
  const [res,setRes] = useState({
    status:"",
    message:""
  })
  const [click,setClick] = useState(false)


  const PhoneRegexpr = new RegExp("^(05|06|07)[0-9]{8}$")

//recharger la page si l'operation est un succes
 useEffect(() => {

  axios.get(`${process.env.REACT_APP_HOST_VAR}rest/roles/getAllRoles`,{ headers:{
    'Authorization': "Bearer"+ userAuth.token
  }})
  .then((response) =>{setRoles(response.data);
   
  
       }
      )
  axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`,{ headers:{
    'Authorization': "Bearer" +  userAuth.token
  }})
  .then((response) =>{setCompanies(response.data);
   
  
       }
      )

    if( res.message !== undefined){
      if(res.message.includes("Utilisateur a été modifié avec succès"))
      {
        
        setShow(false); 
        document.location.reload();
       
      }

    }

    else { return ;}
   
 }, [res]);



 //soumettre le formulaire et envoyer object au serveur  
 const submit = (e) => {
    e.preventDefault();

    if(role.name !== "ROLE_CLIENT"){
      selectedcompany = null;
    }
    else{
      selectedcompany =company
    }
    let object={
       id:objecto.id,
       name:nomUser,
       firstname:firstName,
       lastname:lastName,
       phoneNumber:phone,
       email:email,
       company:selectedcompany,
       departement:departement,
       roles:[
         role
       ]

    }

    let empty=false;

    Object.values(object).forEach(val =>
      { if(val === "") { empty=true; return; } 
      
    });
 
    if(empty===true){return}
    else { axios.put(`${process.env.REACT_APP_HOST_VAR}rest/user/updateUser`,object,{ headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{
     
      setRes({status:response.status,message:response.data.message});
          toast.success(response.data.message)
            setTimeout(() => {
              window.location.reload()
            }, 3000);
         }
        )}
   
    
}
  return (
    <div style={{marginLeft:"10px" ,height:"44px"  }}>
        <Button style={{height:"44px", backgroundColor:"#0243cd"}}  onClick={handleShow}>
        Modifier l'utilisateur
      </Button> 
      <Modal size="lg" show={show} onHide={()=>{handleClose(); setRes("")}}>
        { res.message === "Utilisateur existe déja" ?
      <Alert style={{backgroundColor:"#cd3c31", color:"white"}}>
      <Alert.Heading style={{textAlign:"center",fontSize:"18px"}}> Email ou pseudo déja utilisés</Alert.Heading>
    </Alert> : res.status === 403 || res.status === 404 ? <Alert style={{backgroundColor:"#cd3c31", color:"white"}}>
      <Alert.Heading style={{textAlign:"center",fontSize:"18px"}}> Erreur d'ajout</Alert.Heading>
    </Alert> : <p></p>
    
    }
        <Modal.Header closeButton>
          <Modal.Title>Modifier cet utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <Form style={{display: 'flex', justifyContent: 'space-between',alignItems: 'center', gap:"50px"}} onSubmit={submit}>

          <form style={{width:"50%"}}>
          <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Type utilisateur</Form.Label>
        <Dropdown required>
        <Dropdown.Toggle  required style={{outline: 'none',}} variant="Primary" id="dropdown-basic">
        {role?.name}
      </Dropdown.Toggle>

      <Dropdown.Menu>
      {roles?.map((el, i) =>{
        return (
          <Dropdown.Item key={i}  onClick={()=> setRole({id:el.id, name:el.name})}>{el.name}  </Dropdown.Item>
        )
      })}
        
        
      </Dropdown.Menu>
    </Dropdown>
      </Form.Group>

      <Form.Group className="mb-3" required controlId="formBasicEmail">
        <Form.Label>Nom utilisateur</Form.Label>
        <Form.Control required defaultValue={objecto.name}  maxlength="20" onChange={e=> setUser(e.target.value)} type="text" placeholder="Enter pseudo" />
        {click === true && nomUser === "" ? <p style={{color: "red"}}>Veuillez reseigner ce champ</p> : <p></p>}
      </Form.Group>

      <Form.Group className="mb-3" required controlId="formBasicEmail">
        <Form.Label>Nom</Form.Label>
        <Form.Control  maxlength="20" defaultValue={objecto.lastname} onChange={e=> setLastName(e.target.value)} type="text" placeholder="Enter nom" />
        {click === true && lastName === "" ? <p style={{color: "red"}}>Veuillez reseigner ce champ</p> : <p></p>}
      </Form.Group>

      <Form.Group className="mb-3" value={objecto.firstname}  controlId="formBasicEmail" required>
        <Form.Label>Prenom</Form.Label>
        <Form.Control required  defaultValue={objecto.firstname} maxlength="20" onChange={e=> setFirstName(e.target.value)} type="text" placeholder="Enter prenom" />
        {click === true && firstName === "" ? <p style={{color: "red"}}>veuillez reseigner ce champ</p> : <p></p>}
      </Form.Group>

      <Form.Group className="mb-3" value={objecto.phoneNumber}  controlId="formBasicEmail" required>
        <Form.Label>Téléphone</Form.Label>
        <Form.Control required  defaultValue={objecto.phoneNumber} maxlength="20" onChange={e=> setPhone(e.target.value)} type="text" placeholder="Enter num tel" />
        {click === true && phone === "" ? <p style={{color: "red"}}>Veuillez reseigner ce champ</p> : click === true && phone !== ""  ? !phone.match(PhoneRegexpr) ? <p style={{color: 'red'}}>Veuillez saisir un numéro valide</p> : <p></p> : <p></p> }
      
      </Form.Group>

          </form>
      <form style={{width:"50%"}}>
     

      <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Société</Form.Label>
       { <Dropdown style={{border: '1px solid #ced4da', borderRadius:"5px", }} required>
        <Dropdown.Toggle placeholder="Entrer description"required style={{outline: 'none',}} variant="Primary" id="dropdown-basic">
        {company.nomSociete}
      </Dropdown.Toggle>
      <Dropdown.Menu>
      {companies.length > 0 ? companies.map((el,id) => (
         <Dropdown.Item key={id} onClick={()=> setCompany({id:el.id, nomSociete:el.nomSociete})} >{el.nomSociete}</Dropdown.Item>
         )
      ) : <p style={{fontWeight:"600"}}>Aucune société trouvée</p>  }
     </Dropdown.Menu>
   </Dropdown>
       }
       
       
       {click === true  && company === "" ? <p style={{color: "red"}}>veuillez reseigner ce champ</p> : <p></p>}
   
      </Form.Group>


      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email </Form.Label>
        <Form.Control required defaultValue={objecto.email}  maxlength="20" onChange={e=> setEmail(e.target.value)} type="email" placeholder="Enter email" />
        {click === true & email === "" ? <p style={{color: "red"}}>veuillez reseigner ce champ</p> : <p></p>}
      </Form.Group>


      <Button onClick={(e)=>{submit(e);setClick(true);  }} variant="primary" style={{backgroundColor:"#0243cd"}} type="submit">
        Modifier l'utilisateur
      </Button>
    
      </form>
      </Form>
            <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  color="green"

                  />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{handleClose(); setRes(""); }}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
        
    </div>
  )
}

export default ModifierClient