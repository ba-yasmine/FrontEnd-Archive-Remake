import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/paginationComponent';
import {UserContext} from "../../App"
import {headerTitleContext} from '../../Layout/layout'
import Spinner from 'react-bootstrap/Spinner';
import AjouterBox from "./AjouterBox"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons' 
import AjoutBox from './AjouterBox'
import ModifierBox from './ModifierBox'
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import BoxHistory from './BoxHistory';
import NoResults from '../../components/noResultsFound'
import { BsFilterSquare} from "react-icons/bs";

const ITEMS_PER_PAGE = 10;

const GestionBoites = () => {
 
  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
  const [itemsPerPage,setItemsPerPage] = useState(10)
  const [isMobile, setIsMobile] = useState(false);
  const searchIco = <FontAwesomeIcon style={{color:'#0243cd'}} icon={faSearch}/>
  const [loading,isLoading] = useState(true);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [company, setcompany] = useState();
  const [departement, setdepartement] = useState();
  const [location, setLocation] = useState('');
  const [companies,setCompanies] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullDescription,setFullDescription] = useState("")
  const [sortString, setSortString] = useState('')
  const [provenances,setProvenances] = useState([])
  const fulldescription = <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter}/>
  const [provenance,setProvenance] = useState()
  const [entrepots,setEntrepots] = useState([])
  const [entrepot,setEntrepot] = useState()

  useEffect(() => {
    setheaderTitle('Boites')
    setheaderArrow(false)
  })

  const popover = (
    <Popover style={{fontSize:"15px"}} id="popover-basic">
    <Popover.Header style={{color: "#0243cd"}} as="h3">Description complète:</Popover.Header>
    <Popover.Body style={{color: "#0243cd"}}>
     {fullDescription}
    </Popover.Body>
  </Popover>
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1474) { // Example breakpoint for mobile
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
  
    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    if(company !== null) {
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${company}`,{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{
      
       setProvenances(response.data)
      }
     
          ).catch((err) => {
     
            
          })
    }
    else{
      setProvenances(null)
    }
  
    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`,{ headers:{
      'Authorization': "Bearer" + userAuth.token
    }})
    .then((response) =>{
      setCompanies(response.data);})

      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/entrepot/getAllEntrepot`,{ headers:{
        'Authorization': "Bearer" + userAuth.token
      }})
      .then((response) =>{
        setEntrepots(response.data);})
   


        
    const fetchItems = async () => {
  
   
      const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/boxes/getBoxesPaginated`, {
        params: {
          searchTerm,
          company: company,
          departement: departement,
          location: location,
          provenance:provenance,
          entrepot:entrepot,
          sortString,
          page: currentPage,
          size: itemsPerPage,
        },
        headers:{'Authorization':  "Bearer" + userAuth.token}
      });
     
      isLoading(false)
      setItems(response.data.content);
      setTotalPages(response.data.totalPages);
    };
    fetchItems();
  }, [searchTerm, company, departement, currentPage,sortString, location, itemsPerPage, provenance, entrepot]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handlecompanyChange = (event) => {
   
    setcompany(event.target.value);
    setCurrentPage(0);
  };

  const handledepartementChange = (event) => {
    setdepartement(event.target.value);
    setCurrentPage(0);
  };

  const handleLocationChange = (event) => {
   
    setLocation(event.target.value);
    setCurrentPage(0);
  };

  const handleEntrepotChange = (event) => {
  
    setEntrepot(event.target.value);
    setCurrentPage(0);
  };
  return (
   
    <div >
       
        <div style={{display: "flex",justifyContent: "space-between", alignItems: "center", padding:`${isMobile ? '70px 10px' : '10px 30px'}`, backgroundColor:'white'}}>
        {isMobile ? <div>

          <Button style={{backgroundColor:'white', border:'none'}} onClick={handleShow}>
        <BsFilterSquare style={{color:'#0243cd', fontSize:'35px'}}/>
      </Button>

      <Offcanvas style={{color:'#0243cd'}} show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title >Filtrer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div style={{display: "flex",flexDirection: "column", gap:'5px'}}>
        
        <Form.Select  aria-label="Default select example" onChange={handlecompanyChange}>
      <option value="" >Société : Toutes</option>
      {companies?.map(el => (
        <option value={el.id}>{el.nomSociété}</option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleLocationChange}>
    <option value=''>Localisation: Toutes</option>
    <option value='At_Warehouse'>Localisation: a l'entrepot</option>
    <option value='At_Customer'>Localisation: chez le client</option>
    <option value='Pending'>Localisation: en attente</option>
     
    </Form.Select>

    <Form.Select
    onChange={(e)=> {setProvenance(e.target.value); setProvenance(e.target.value)}}
    aria-label="Default select example">
   <option value=''>Provenance: toutes</option>
   {provenances?.map((el,id)=>{
    return  <option key={id} value={el.id}>Provenance {el.adresse}</option>
   })}
     
    </Form.Select>
    <Form.Select
    onChange={handleEntrepotChange}
    aria-label="Default select example">
   <option value=''>Entrepots: tous</option>
   {entrepots?.map((el,id)=>{
    return  <option key={id} value={el.id}>Entrepot {el.name}</option>
   })}
     
    </Form.Select>

        </div>
        </Offcanvas.Body>
      </Offcanvas>
        </div> : 
        <div>
          <h5 style={{color:'#0243cd'}}>Filtrage:</h5>
          <div style={{display: "flex", gap:'5px', alignItems:'center', justifyContent: 'center', border :'1px solid #0243cd', borderRadius :'5px', padding:'15px'}}>
        
         

        <Form.Select  aria-label="Default select example" onChange={handlecompanyChange}>
      <option value='' >Société: Toutes</option>
      {companies?.map(el => (
        <option value={el.id}>Société: {el.nomSociete}</option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleLocationChange}>
    <option value=''>Localisation: Toutes</option>
    <option value='At_Warehouse'>Localisation: a l'entrepot</option>
    <option value='At_Customer'>Localisation: chez le client</option>
    <option value='Pending'>Localisation: en attente</option>
     
    </Form.Select>

    <Form.Select
    onChange={(e)=> setProvenance(e.target.value)}
    aria-label="Default select example">
   <option value=''>Provenance: toutes</option>
   {provenances?.map((el,id)=>{
    return  <option key={id} value={el.id}>Provenance {el.adresse}</option>
   })}
     
    </Form.Select>

    <Form.Select
    onChange={handleEntrepotChange}
    aria-label="Default select example">
   <option value=''>Entrepots: toutes</option>
   {entrepots?.map((el,id)=>{
    return  <option key={id} value={el.id}>Entrepot {el.name}</option>
   })}
     
    </Form.Select>
        </div>
        </div>
        
        }
        
        
       <div style={{ marginLeft: '15px' }}>
        <InputGroup  >
        <InputGroup.Text id="basic-addon1">{searchIco}</InputGroup.Text>
        <Form.Control
        value={searchTerm} onChange={handleSearch}
          placeholder="rechercher une boite"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
       </InputGroup>
      </div>
          
        </div>
        
     
      <hr />
    
      {loading === true ? <div style={{display: 'flex',justifyContent:'center',paddingTop:"100px"}}><Spinner animation="border"  variant="primary" /> </div> : items.length !== 0  ? 
        <div style={{borderRadius:"10px",  margin:"auto", backgroundColor:"white", color:"#0243cd", marginBottom:"30px",marginTop:"40px", padding:'30px'}}>
                  <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'20px', gap:'10px'}}>
        <Form.Select style={{width:'200px'}} onChange={(e)=> {setItemsPerPage(e.target.value); setCurrentPage(0)}
        } aria-label="Default select example">
    <option value='10'>10</option>
    <option value='25'>25</option>
    <option value='50'>50</option>
    <option value='100'>100</option>
     
    </Form.Select>
    <AjouterBox/>
    </div >
          
            <Table style={{borderRadius:"10px", width:"100%", margin:"auto"}} responsive>
     
            <thead style={{height:"80px", fontSize:"17px"}}>
     <tr>
       
     <th style={{fontWeight:"600"}}>Code à barre </th>
     <th style={{fontWeight:"600"}}>Description</th>
     <th style={{fontWeight:"600"}}>Société</th>
     <th style={{fontWeight:"600"}}>Emplacement</th>
     <th style={{fontWeight:"600"}}>Géolocalisation</th>
     <th style={{fontWeight:"600"}}>Département</th>
     <th style={{fontWeight:"600"}}>Date de création</th> 
     <th style={{fontWeight:"600"}}>Date de destruction </th>
     <th style={{fontWeight:"600"}}>Modifier</th>
     <th style={{fontWeight:"600"}}>Historique</th>
      
     </tr>
   </thead>
   <tbody>
     {items.length > 0 ? items.map((el,id)=>{
   return (
    <tr key={id}>
 <td>{el.codeBarre === null  ? <p style={{color:"red", fontWeight:"600"}}>Pas de code</p> : el.codeBarre}</td> 
    <td>
  {el?.description 
    ? (el.description.length > 50 
        ? <div>
            {el.description.slice(0,50)+" ..."} 
            <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
              <Button style={{border:"none", background:"none", color:"#0243cd"}} variant="success" onMouseEnter={()=>setFullDescription(el.description)}>{fulldescription}</Button>
            </OverlayTrigger>
          </div> 
        : el.description)
    : <p>Not Found</p>
  }
</td>
        <td>{el?.provenance?.company.nomSociete}</td>
        <td>{el.location}</td>
        <td>{el.geolocalisation}</td>
        <td>{el.departements ? el.departements.nom : "null"}</td>
        <td>{el.createDate}</td>
        <th>{el.destroyDate  }</th>
       <td> <ModifierBox  boite={el} /> </td>
       <td> <BoxHistory boxInfos={el} /> </td>
     </tr>
   )  
     } 
     
     )
     :
     
     <tr>Fin des résultats</tr>
     }
     
   </tbody>
  

  </Table>
  <br />
  <Pagination
    page={currentPage}
    totalPages={totalPages}
    onPageChange={handlePageChange}
  />
   </div> : <NoResults/>}
  
  
  </div>


  )
    }

  export default  GestionBoites