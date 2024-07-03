import React,{useEffect,useState,useContext} from 'react'
import axios from 'axios'
import {UserContext} from "../App"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import NavAdmin from './NavbarAdmin'
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons'
import ListGroup from 'react-bootstrap/ListGroup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDetails = () => {

  const {userAuth,setUserAuth} = useContext(UserContext);
  const [UserData,setUserData] = useState([])
  const [companies,setCompanies] = useState([])
  const [companies2,setCompanies2] = useState([])
  const [CompanyName,setCompanyName] = useState("")
  const [CompanyAdresse,setCompanyAdresse] = useState("")
  const [dep,setDep] = useState([])
  const [nomDep,setNomDep] = useState("")
  const [dep2,setDep2] = useState([])

    const boxesIco =<FontAwesomeIcon style={{ color:"#0243cd", margin:"auto",marginRight:"5px"}} size="1x" icon={faUser}/>
    const boxesIco2 =<FontAwesomeIcon style={{ color:"#0243cd", margin:"auto"}} size="5x" icon={faBeerMugEmpty}/>
   
   
   //fetch des données de l'admin
    useEffect(()=>{

      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getAllDepartements`,{ headers:{
        'Authorization': "Bearer" +  userAuth.token
      }})
      .then((response) =>{setDep(response.data); })


            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getUserById/${userAuth.ID}`,{ headers:{
              'Authorization': "Bearer" +  userAuth.token
            }})
            .then((response) =>{setUserData(response.data);
              
                 }
                )

                
                  axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`,{ headers:{
                    'Authorization': "Bearer" + userAuth.token
                  }})
                  .then((response) =>{setCompanies(response.data);
                 
                  
                       }
                      )
                
              
  

    },[companies2]

        )
        const addDepartement =() => {
           
          
          axios.post(`${process.env.REACT_APP_HOST_VAR}rest/departements/addDepartement`,nomDep,{ headers:{
            'Authorization':  "Bearer"+userAuth.token
          }})
          .then((response) =>{setCompanies2([]); toast(response.data.message)});
               
        }

        const addCompany=() => {

          if(CompanyName === "" || CompanyAdresse === "" ){ 
            toast("Veuillez d'abord remplire les champs!");
            return;
          }
         let company= {
          "nomSociété":CompanyName,
          "adresse":CompanyAdresse
         }

          axios.post(`${process.env.REACT_APP_HOST_VAR}rest/company/addCompany`,company,{ headers:{
            'Authorization':  "Bearer" + userAuth.token
          }})
          .then((response) =>{
            if(response.status === 403 || response.status === 404){
              toast("Erreur d'ajout !");
            }
            else
            { 
              toast(response.data.message);
            }
          
            setCompanies2([]);
            
               
          
               }
              )
        }
  
    return (
      <div style={{backgroundImage: `url("https://i.postimg.cc/MZg9Fwb9/Adobe-Stock-354864057.jpg")`, height:"100vh", backgroundRepeat:"repeat", paddingTop:"20px",backgroundSize:"cover", color:"#0243cd", overflowY:"auto"}}>
           <NavAdmin isArrow={true} />
            <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
            {UserData.length === 0  ? <div style={{width:"97%", backgroundColor:"white",minHeight:"100%", margin:"auto", textAlign:"center",boxShadow:"rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",borderRadius:"10px", paddingTop:"100px", marginTop:"30px"}}>{boxesIco2}<p style={{textAlign:"center", width:"100%", marginTop:"50px", color:"#0243cd", fontSize:"25px"}}>utilisateur introuvable</p></div> :
          
            <div style={{ width:"97%",margin:"auto",  minHeight:"100%", marginBottom:"10px", padding:"50px", borderRadius:"5px",marginTop:"30px", backgroundColor:"white",boxShadow:"rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
            <div style={{ width: '90%',margin:"auto", marginBottom:"50px" }}>
            <div className="AdminDetails" style={{display:"flex",justifyContent:"space-around", alignItems: "center",margin:"auto", marginTop:"25px",marginBottom:"50px", }}> 
            <div style={{display:"flex",flexDirection:"column",width:"35%",}}>

              <h3 style={{textAlign:"center",marginTop:"40px",color:"#0243cd",marginBottom:"30px"}}>{userAuth.role === "CUSTOMER" ? <p>{boxesIco}Profil utilisateur</p> : <p>{boxesIco}Profil administrateur</p>}</h3>
        
           <ListGroup as="ol" >
         <ListGroup.Item
         style={{color:"#0243cd"}}
           as="li"
           className="d-flex justify-content-between align-items-start"
         >
           <div className="ms-2 me-auto">
             <div className="fw-bold" style={{fontSize: "20px"}}>Nom d'utilisateur</div>
             {UserData.name}
           </div>
          
         </ListGroup.Item>
         <ListGroup.Item
         style={{color:"#0243cd"}}
           as="li"
           className="d-flex justify-content-between align-items-start"
         >
           <div className="ms-2 me-auto">
             <div className="fw-bold" style={{fontSize: "20px"}}>Nom </div>
             {UserData.lastname}
           </div>
          
         </ListGroup.Item>
         <ListGroup.Item
         style={{color:"#0243cd"}}
           as="li"
           className="d-flex justify-content-between align-items-start"
         >
           <div className="ms-2 me-auto">
             <div className="fw-bold" style={{fontSize: "20px"}}>Prenom</div>
             {UserData.firstname}
           </div>
          
         </ListGroup.Item>
         <ListGroup.Item
         style={{color:"#0243cd"}}
           as="li"
           className="d-flex justify-content-between align-items-start"
         >
           <div className="ms-2 me-auto">
             <div className="fw-bold" style={{fontSize: "20px"}}>Email</div>
             {UserData.email}
           </div>
          
         </ListGroup.Item>
         <ListGroup.Item
         style={{color:"#0243cd"}}
           as="li"
           className="d-flex justify-content-between align-items-start"
         >
           <div className="ms-2 me-auto">
             <div className="fw-bold" style={{fontSize: "20px"}}>Société</div>
             {UserData.company.nomSociété}
           </div>
           
         </ListGroup.Item>
         <ListGroup.Item
         style={{color:"#0243cd"}}
           as="li"
           className="d-flex justify-content-between align-items-start"
         >
           <div className="ms-2 me-auto">
             <div className="fw-bold" style={{fontSize: "20px"}}>Statut</div>
             {UserData.role}
           </div>
           
         </ListGroup.Item>
       </ListGroup>
       </div> 
     
    
     
       </div> 
     
    </div>

      
  </div>
}
</div>     
      
       
  )
}

export default UserDetails