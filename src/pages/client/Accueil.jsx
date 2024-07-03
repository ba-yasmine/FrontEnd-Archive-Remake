import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import React,{useContext, useEffect} from 'react'
import '../Administrateur/style.css'
import {UserContext} from "../../App"
import {headerTitleContext} from '../../Layout/layout'
import BoxesByTransactonClient from "./statistiques/boxesByTransactionclient"
import BoxeIncompanyByDepartement from "./statistiques/boxesInCompanyByDepartements"
import BoxesInCompanyByLocation from "./statistiques/boxesInCompanyByLocation"





const Accueil = () => {

  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
    const {userAuth,setUserAuth,styleMode} = useContext(UserContext);
    let navigate = useNavigate();

    useEffect(() => {
      setheaderTitle('Accueil')
      setheaderArrow(false)
    })
  

  return (
    <div>
        
        
        <div >
        <br />
        <br />
        <h4 style={{textAlign:"center",color:"#0243cd",marginBottom:"100px"}}> Faire une demande:</h4>
        <div id='process' style={{display : "flex" , justifyContent:"center",alignItems:"center", gap:"40px"}}>
        <Card border="primary" 
        onClick={() => navigate(`/Client/Demandes/${userAuth.ID}/${userAuth.company}/addBox`)  }
        style={{ width: '22rem' ,color:"white", background: "#033fbe", cursor: 'pointer'
}}>
        <Card.Header>Processus</Card.Header>
        <Card.Body>
          <Card.Title>AJOUT DE BOITES</Card.Title>
          <Card.Text>
            Créez un lot Add Box 
          </Card.Text>
        </Card.Body>
      </Card>
      

      <Card border="secondary"  onClick={() => navigate(`/Client/Demandes/${userAuth.ID}/${userAuth.company}/boxRequest`)  } style={{ width: '22rem',color:"white" , background: "#033fbe",cursor: 'pointer'}}>
        <Card.Header>Processus</Card.Header>
        <Card.Body>
          <Card.Title> DEMANDE DE BOITES </Card.Title>
          <Card.Text>
          Créez un lot Box Request 
          </Card.Text>
        </Card.Body>
      </Card>
      

      <Card border="success"  onClick={() => navigate(`/Client/Demandes/${userAuth.ID}/${userAuth.company}/boxReturn`)  } style={{ width: '22rem', color:"white",  background: "#033fbe", cursor: 'pointer' }}>
        <Card.Header>Processus</Card.Header>
        <Card.Body>
          <Card.Title>RETOUR DE BOITES </Card.Title>
          <Card.Text>
          Créez un lot Box Return 
          </Card.Text>
        </Card.Body>
      </Card>
  
        </div>
        <h4 style={{fontWeight:"600", color:"#0243cd",textAlign:'center',marginTop:"120px"}}>Statistiques:</h4>
       <br />
       <hr style={{width:"20%",margin:'auto', color:'#0243cd',height:'5px'}} />
       <br />
       <div style={{ display:'grid', gridTemplateColumns: "repeat( auto-fit, minmax(400px, 2fr) )",gridGap:'20px', padding:"5px",margin:'auto'}}>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <BoxesByTransactonClient/> </div>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <BoxeIncompanyByDepartement/></div>
          <div style={{border: '2px solid #e5e7eb', padding:"10px",height:'400px', borderRadius:'10px'}}> <BoxesInCompanyByLocation/></div>
       </div>
        </div>
        
        </div>
  )
}

export default Accueil