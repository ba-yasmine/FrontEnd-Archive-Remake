import React,{useEffect,useState,useContext} from 'react'
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import "../Administrateur/style.css"
import NavBar from '../../components/NavbarClient'
import { useParams } from "react-router-dom";
import {UserContext} from "../../App"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import {headerTitleContext} from '../../Layout/layout'

const DemandePreview = ({lotID}) => {


    const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const [Expand,setExpand] = useState([])
    const [provenance,setprovenance] = useState("")
    const [statut,setStatut] = useState("")
    const [fullDescription,setFullDescription] = useState("")
    let params  = useParams();
 

    const boxesIco =<FontAwesomeIcon style={{ color:"#0243cd", margin:"auto"}} size="4x" icon={faCircleInfo}/>
    const fulldescription = <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter}/>

    const popover = (
      <Popover style={{fontSize:"15px", width:"500px"}} id="popover-basic">
      <Popover.Header style={{color: "#0243cd"}} as="h3">Description complète:</Popover.Header>
      <Popover.Body style={{color: "#0243cd"}}>
       {fullDescription}
      </Popover.Body>
    </Popover>
    )

    useEffect(() => {
      setheaderTitle('Informations du lot ' + params.demandeid)
      setheaderArrow(true)
    })
  
 //fetch des données relatives au lot dés le chargement du composant
 useEffect(()=>{

      
            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/batches/getBatches/${params.company}/${params.demandeid}`,{ headers:{
              'Authorization':  "Bearer" + userAuth.token
            }})
            .then((response) =>{
              
              setStatut(response.data.statutLots[response.data.statutLots.length -1]?.statut.batchStatus)
              setprovenance(response.data?.boxes[0]?.provenance.adresse)
             
              setExpand(response.data);
                   
                 }
                )
    },[]

        )
  
    return (
      <div >
           
            
        
          
            <div style={{minHeight:'100%' , display:"flex" ,flexDirection:"column",gap:'0px', width:"97%",margin:"auto",  marginBottom:"10px", padding:"50px", borderRadius:"5px",marginTop:"30px", backgroundColor:"white", }}>
            <div style={{ width: '60%',margin:"auto", marginBottom:"30px" }}>
       
            <Card id='batchExpand' style={{color:"#0243cd"}} >
          <Card.Body>
            {Expand !== undefined  && Expand !== null ? <div>
              
              <Card.Title>Type de demande: {Expand.requestType}</Card.Title>
              <hr />
              <br />
            <Card.Subtitle className="mb-2 text-muted">Nombre de boites : {Expand.nbrBoites}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Provenance : {provenance} </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Statut : {statut} </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Société :  {Expand?.createur?.company?.nomSociete}   </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Date de création:  {Expand.creationDate}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Employé: {Expand?.createur?.name} </Card.Subtitle>
            <Card.Text>
         
            
    
          
            </Card.Text>
            </div>  : <></>}
   
          </Card.Body>
        </Card>
            </div>
            

        

        <div style={{width:"90%", margin:"auto"}}>
        <h4 style={{textAlign:"center",marginBottom:"30px", color:"#0243cd"}}> les boites associées</h4>
        {Expand.boxes !== undefined &&  Expand.boxes.length > 0 ?
        <Table style={{borderRadius:"10px", width:"100%", color:"#0243cd", margin:"auto"}} responsive>
     
        <thead style={{height:"50px", backgroundColor:"#f2f6fe" , fontSize:"15px"}}>
        <tr>
          
        <th  style={{fontWeight:"600"}}>Code à barre</th>  
       <th  style={{fontWeight:"600"}}>Description</th>
       <th  style={{fontWeight:"600"}}>Département</th>
       <th  style={{fontWeight:"600"}}>Provenance</th>
       <th  style={{fontWeight:"600"}}>Emplacement</th>
      
        </tr>
      </thead>
      <tbody style={{color:"#0243cd"}}>
        { Expand.boxes !== undefined &&  Expand.boxes.length > 0 ? Expand.boxes.map((el,id)=>{
      return (
       <tr style={{height:"50px", color:"#0243cd" }} key={id}>
       
      <td>{el.codeBarre !== null ? el.codeBarre :  <p style={{fontWeight:'600', color:'red'}}>non attribuée</p>}</td>
      <td >{el.description != null ? el.description?.length > 50 ? <div>{el?.description?.slice(0,50)+" ..."} <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
    <Button style={{border:"none", background:"none", color:"#0243cd"}} variant="success" onMouseEnter={()=>setFullDescription(el.description)}>{fulldescription}</Button>
  </OverlayTrigger></div>  : el.description : <p style={{fontWeight:'600', color:'red'}}>non attribuée</p>}  </td>
         
          <td>{el.departements?.nom !== undefined ? el?.departements.nom :  <p style={{fontWeight:'600', color:'red'}}>non attribuée</p>}</td>
          <td>{el?.provenance?.adresse}</td>
          <td>{el.location}</td>
         
          
        </tr>
      )  
        } 
        
        )
        :
        
        <tr></tr>
        }
        
      </tbody>
    </Table>
    
    : <h5 style={{textAlign: 'center'}}>Lot vide :\ </h5>
    }
        </div>
        
   
          
        
       

    </div>
        </div>
           
       
  )
}

export default DemandePreview