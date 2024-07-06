import React,{useEffect,useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Alert from 'react-bootstrap/Alert';
import 'react-toastify/dist/ReactToastify.css';
import {UserContext} from "../../App"
import { IoIosAddCircleOutline } from "react-icons/io";
import '../../components/styleButton.css';

const AjoutClient = () => {

    const [show, setShow] = useState(false);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const handleClose = () => { setShow(false);}
    const handleShow = () => setShow(true);
    const [role,setRole] = useState({id:"", name:""})
    const [nomUser,setUser] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [firstName,setFirstName] = useState("")
    const [phone,setPhone] = useState("")
    const [lastName,setLastName] = useState("")
    const [company,setCompany] = useState({id:"", nomSociete:""})
    const [departement,setDepartement] = useState("Compatbilité")
    const [companies,setCompanies] = useState([])
    const [roles,setRoles] = useState([])
    const [isLoading,setLoading] = useState(false)
    const [entrepotList, SetEntrepotList]= useState([])
    const [entrepot, SetEntrepot]= useState("")
    let selectedcompany
    const [res,setRes] = useState({
      status:"",
      message:""
    })
   
    const PhoneRegexpr = new RegExp("^(05|06|07)[0-9]{8}$")

  //recharger la page si l'operation est un succes  
  useEffect(() => {


  axios.get(`${process.env.REACT_APP_HOST_VAR}rest/entrepot/getAllEntrepot`,{headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{
    SetEntrepotList(response.data)
    SetEntrepot(response.data[0].id)
  }
      ).catch((err) => {
      })

  axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`,{ headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
  .then((response) =>{
   
    setCompanies(response.data); setCompany({id: response.data[0].id, nomSociete: response.data[0].nomSociete})
   
  
       }
      )

      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/roles/getAllRoles`,{ headers:{
        'Authorization': "Bearer" +  userAuth.token
      }})
      .then((response) =>{
        setRoles(response.data); setRole({id:response.data[0].id, name:response.data[0].name} 
          )
      
           }
          )
    

     
   }, [res]);



//soumettre le formulaire et envoyer object au serveur  
const submit = (e) => {

        e.preventDefault();
        //if(role.name !== "ROLE_CLIENT"){
         // selectedcompany = null
    //    }
       // else{
          selectedcompany =company
       // }
      
       setLoading(true)
        let object={
           name:nomUser,
           firstname:firstName,
           lastname:lastName,
           phoneNumber:phone,
           password:password,
           email:email,
           company:selectedcompany,
           departement:departement,
           entrepotId:entrepot,
           roles:[
              role
           ]

        }
   
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/user/createUser`,object,{ headers:{
          'Authorization':  "Bearer" + userAuth.token
        }})
        .then((response) =>{ 
             setLoading(false);
             setShow(false); 
             document.location.reload();
              
           
             }
            ).catch((error) =>{
              setLoading(false);
               toast.error("Impossible de créer l'utilisateur")
            })

        
        
    }

  return (
    <div style={{marginLeft:"10px" ,height:"44px"  }}>
      <div className="buttonStyle">
          <Button
                style={{ height: "44px", width: "105%",textAlign: "center", marginRight:'20px'  }}
                variant="primary"
                onClick={handleShow}
            >
              <IoIosAddCircleOutline style={{ marginRight: '8px'}} />
              utilisateur
          </Button>
      </div>
      <Modal size="lg" show={show} onHide={()=>{handleClose(); setRes("")}}>
        { res.message === "L'utilisateur existe déja !" ?
      <Alert style={{backgroundColor:"#cd3c31", color:"white"}}>
      <Alert.Heading style={{textAlign:"center",fontSize:"18px",}}> Email ou pseudo a déja été utilisé</Alert.Heading>
    </Alert> : res.status === 403 || res.status === 404 ? <Alert style={{backgroundColor:"#cd3c31", color:"white"}}>
      <Alert.Heading style={{textAlign:"center",fontSize:"18px"}}> Erreur d'ajout</Alert.Heading>
    </Alert> : <p></p>
    
    }
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"

            />
        <Form style={{display: 'flex', justifyContent: 'space-between',alignItems: 'center', gap:"50px"}} onSubmit={submit}>

          <div style={{width:"50%"}}>
          <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Role</Form.Label>
        <Dropdown required>
        <Dropdown.Toggle  required style={{outline: 'none',}} variant="Primary" id="dropdown-basic">
        {role.name}
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
        <Form.Control required maxlength="20" onChange={e=> setUser(e.target.value)} type="text" placeholder="Entrer un pseudo" />
        
      </Form.Group>

      <Form.Group className="mb-3" required controlId="formBasicEmail">
        <Form.Label>Nom</Form.Label>
        <Form.Control required maxlength="20" onChange={e=> setLastName(e.target.value)} type="text" placeholder="Entrer un nom" />
        
      </Form.Group>

      <Form.Group className="mb-3" required controlId="formBasicEmail">
        <Form.Label>Prénom</Form.Label>
        <Form.Control required maxlength="20" onChange={e=> setFirstName(e.target.value)} type="text" placeholder="Entrer un prenom" />
        
      </Form.Group>

      <Form.Group className="mb-3" required controlId="formBasicEmail">
        <Form.Label>Téléphone</Form.Label>
        <Form.Control required maxlength="20" onChange={e=> setPhone(e.target.value)} type="text" placeholder="Entrer numéro tel." />
        {phone !== "" ? !phone.match(PhoneRegexpr) ? <p style={{color: 'red'}}>Veuillez saisir un numéro valide</p> : <p></p> : <p></p>}
      </Form.Group >
          </div>
      <div style={{width:"50%"}}>
      
      {role.name === "ROLE_ARCHIVIST" ? <Form.Group className="mb-3" required controlId="formBasicEmail">
        <Form.Label>Entrepot </Form.Label>
        <Form.Select required onChange={(e)=> { SetEntrepot(e.target.value)}}   aria-label="Default select example">
     
     {entrepotList?.map((el,id) =>{
      return  <option key={id} value={el.id}>{el.name}</option>
     })}
    
  </Form.Select>
       
      </Form.Group > : <></>}
      <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Société</Form.Label>
       {<Dropdown style={{border: '1px solid #ced4da', borderRadius:"5px"}} required>
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
       
       

   
      </Form.Group>


      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email </Form.Label>
        <Form.Control required maxlength="30" onChange={e=> setEmail(e.target.value)} type="email" placeholder="Entrer email" />
       
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control required  maxlength="30" onChange={e=> setPassword(e.target.value)} type="password" placeholder="Entrer mot de passe" />
      </Form.Group>

        <div className="buttonStyle">
            {isLoading === true ? <h6 style={{fontWeight:"600", color: "#0243c"}}>Patientez ... </h6> : <Button  variant="primary" type="submit">Ajouter utilisateur</Button>}
        </div>
    
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

export default AjoutClient