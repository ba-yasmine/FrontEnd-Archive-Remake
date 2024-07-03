import NavCoordinateur from '../../components/navBarCoordinateur'
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from "react-router-dom";
import Analytics from "../Administrateur/Analyticss";
import React ,{useContext, useEffect}   from 'react'
import '../Administrateur/style.css'
import {headerTitleContext} from '../../Layout/layout'
import BoxesByDepartement from "./Statistiques/boxesByCompnyDepartements"
import BoxesByLocationCompany from "./Statistiques/boxesByLocationCompany"
import BoxeNumberByWarehouse from "./Statistiques/BoxesNumberByWarehouse"
import CompaniesInWareHouse from "./Statistiques/companiesInWarehouses"
import BoxByTransaction from "./Statistiques/BoxByTransaction"

const Accueil = () => {

  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
   let navigate = useNavigate();

   useEffect(() => {
    setheaderTitle('Accueil')
    setheaderArrow(false)
  })


  return (
  
        <div  >
       
       <h4 style={{fontWeight:"600", color:"#0243cd",textAlign:'center',marginTop:"70px"}}>Statistiques:</h4>
       <br />
       <hr style={{width:"20%",margin:'auto', color:'#0243cd',height:'5px'}} />
       <br />
       <div style={{ display:'grid', gridTemplateColumns: "repeat( auto-fit, minmax(400px, 2fr) )",gridGap:'20px',margin:'auto', padding:'5px'}}>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <BoxesByDepartement/></div>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <BoxesByLocationCompany/></div>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <BoxeNumberByWarehouse/></div>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <CompaniesInWareHouse/></div>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <BoxByTransaction/></div>
        
       </div>
        </div>
        
        
  )
}

export default Accueil