import React,{useEffect,useState,useContext} from 'react'
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useParams } from "react-router-dom";
import {UserContext} from "../App"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import NavBar from './NavbarClient'
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons'
import ListGroup from 'react-bootstrap/ListGroup';
import {AiOutlineUser} from "react-icons/ai"
import {headerTitleContext} from '../Layout/layout'
import './styleButton.css';

const UserDetails = () => {

   const {userAuth,setUserAuth} = useContext(UserContext);
   const [Lookup,setLookup] = useState([])
   const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);


   
   useEffect(() => {
    setheaderTitle('Profil utilisateur')
    setheaderArrow(false)
  })
 

   const boxesIco =<AiOutlineUser style={{ color:"#0243cd", margin:"auto", fontSize:"50px"}}/>
  
   
   
   //fetch des données du user en question
    useEffect(()=>{

            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getUserById/${userAuth.ID}`,{ headers:{
              'Authorization':  "Bearer" + userAuth.token
            }})
            .then((response) =>{setLookup(response.data);
                   
                 }
                )

    },[]

        )
  
    return (
      <div style={{paddingTop:'50px'}} >
           
            
           {Lookup.length === 0  ? <div style={{margin:"auto"}}> <h4 style={{color:"#0243cd"}}>Utilisateur introuvable</h4></div> :
          
          <div >
          <div style={{ width: '60%', margin:'auto' }}>
          <div style={{display:"flex", flexDirection:"column",margin:"auto", alignItems:'center',  }}>{boxesIco}  <h5 style={{textAlign:"center",marginTop:"20px",color:"#0243cd"}}> Profil utilisateur </h5></div>
   <br />

        <ListGroup id="lists" style={{margin:"auto"}} as="ol" >
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" , paddingBottom:'10px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"16px", fontWeight:"600"}}>Nom d'utilisateur</div>
          <div style={{ fontSize:'14px'}} >{Lookup.name}</div>
        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" , paddingBottom:'10px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"16px", fontWeight:"600"}}>Nom </div>
          <div style={{ fontSize:'14px'}} >{Lookup.lastname}</div>

        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" , paddingBottom:'10px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"16px", fontWeight:"600"}}>Prenom</div>
          <div style={{ fontSize:'14px'}} >{Lookup.firstname}</div>

        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" , paddingBottom:'10px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"16px", fontWeight:"600"}}>Email</div>
          <div style={{ fontSize:'14px'}} >{Lookup.email}</div>

        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" , paddingBottom:'10px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"16px", fontWeight:"600"}}>Société</div>
          <div style={{ fontSize:'14px'}} >{Lookup.company.nomSociete}</div>

        </div>

      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" , paddingBottom:'10px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div  style={{fontSize:"16px", fontWeight:"600"}}>Poste</div>
          <div style={{ fontSize:'14px'}} >{Lookup.roles[0].name}</div>

        </div>
        
      </ListGroup.Item>
    </ListGroup>
            </div>
   

     
    </div>

      }
        </div>
           
       
  )

}

export default UserDetails