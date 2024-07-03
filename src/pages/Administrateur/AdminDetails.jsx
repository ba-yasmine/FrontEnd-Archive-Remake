import React,{useEffect,useState,useContext} from 'react'
import axios from 'axios'
import {UserContext} from "../../App"
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons'
import ListGroup from 'react-bootstrap/ListGroup';
import NavCoordinateur from '../../components/navBarCoordinateur'
import {AiOutlineUser} from "react-icons/ai"
import {headerTitleContext} from '../../Layout/layout'

const AdminProfile = () => {

   const {userAuth,setUserAuth} = useContext(UserContext);
   const [Lookup,setLookup] = useState([])
   const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
 

   const boxesIco =<AiOutlineUser style={{ color:"#0243cd", margin:"auto", fontSize:"50px"}}/>
    
   


    useEffect(() => {
      setheaderTitle('Profil utilisateur')
      setheaderArrow(false)
    })


   
   //fetch des données du user en question
    useEffect(()=>{

            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getUserById/${userAuth.ID}`,{ headers:{
              'Authorization':  "Bearer" + userAuth.token
            }})
            .then((response) =>{setLookup(response.data);
                   
                 }
                )},[]

        )
  
    return (
      <div style={{paddingTop:'50px'}} >
           
            
           {Lookup.length === 0  ? <div style={{margin:"auto"}}> <h4 style={{color:"#0243cd"}}>utilisateur introuvable</h4></div> :
          
          <div >
          <div style={{ width: '80%', margin:'auto' }}>
          <div style={{display:"flex", flexDirection:"column",margin:"auto", alignItems:'center',  }}>{boxesIco}  <h5 style={{textAlign:"center",marginTop:"20px",color:"#0243cd"}}> Profil utilisateur </h5></div>
   <br />

        <ListGroup style={{margin:"auto"}} as="ol" >
      <ListGroup.Item
      style={{color:"#0243cd"}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"17px", fontWeight:"600"}}>Nom d'utilisateur</div>
          {Lookup.name}
        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"#0243cd"}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"17px", fontWeight:"600"}}>Nom </div>
          {Lookup.lastname}
        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"#0243cd"}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"17px", fontWeight:"600"}}>Prenom</div>
          {Lookup.firstname}
        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"#0243cd"}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"17px", fontWeight:"600"}}>Email</div>
          {Lookup.email}
        </div>
       
      </ListGroup.Item>
      
      <ListGroup.Item
      style={{color:"#0243cd"}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"17px", fontWeight:"600"}}>Poste</div>
          {Lookup.roles[0].name}
        </div>
        
      </ListGroup.Item>
    </ListGroup>
            </div>
            

     
    </div>

      }
        </div>
           
       
  )
}

export default AdminProfile