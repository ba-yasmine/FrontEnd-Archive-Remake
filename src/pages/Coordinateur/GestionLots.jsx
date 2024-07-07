import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/paginationComponent';
import {UserContext} from "../../App"
import Spinner from 'react-bootstrap/Spinner';
import NavCoordinateur from '../../components/navBarCoordinateur'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import BatchPickupModal from '../../components/pickupModal'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import {headerTitleContext} from '../../Layout/layout' 
import NoResults from '../../components/noResultsFound'
import { BsFilterSquare} from "react-icons/bs";
import ProgramDestruction from "../../components/ProgramDestruction"
import PickupDeliveryModal from "../../components/ProgramPickupOrDeliveryModal"
import RedirectToWarehouse from '../../components/RedirectToWareHouseModal'
import RedirectToTransportor from '../../components/ChooseTransportorModel'



const MatchTreatement= (batch) =>{
  let array =[...batch.statutLots]
  const sortedObjects = array.sort((a, b) => new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime());
  const latestObject = sortedObjects[0];

  if(batch.dateLivraisonPickup === null  && batch.requestType !== "Box_Shredding"){
    return <PickupDeliveryModal  batchType={batch}/>
  }
  else if(latestObject.statut.batchStatus === "EN_ATTENTE_TRANSPORTEUR"){
    return <RedirectToTransportor  batchId={batch}/>
  }
  else if(latestObject.statut.batchStatus === "EN_ATTENTE"){
    if( batch.requestType ==="Box_Shredding"){
      return <ProgramDestruction  batchId={batch}/>
    }
    return <RedirectToWarehouse  batchId={batch}/>
  }
  else if(latestObject.statut.batchStatus === "TRAITE_PAR_ARCHIVISTE"){
    if(batch.requestType === "Box_Request"){
      return <RedirectToTransportor  batchId={batch}/>

    }
  }
  else{
    return <p style={{fontWeight:"600", color:'#0243cd' }}>Aucun traitement</p>
  }

}

const GestionUsers = () => {
 
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
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState('');
  const [companies,setCompanies] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [statut, setStatut] = useState('');
  const [sortString, setSortString] = useState('')
  const sortIco = <FontAwesomeIcon icon={faSort}/>
  const filterIco = <FontAwesomeIcon style={{marginLeft: "10px", }} icon={faFilter}/>
  const infoIco = <FontAwesomeIcon icon={faCircleInfo}/>

  useEffect(() => {
    setheaderTitle('Lots')
    setheaderArrow(false)
  })


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1205) { // Example breakpoint for mobile
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

    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`,{ headers:{
      'Authorization': "Bearer" + userAuth.token
    }})
    .then((response) =>{
      setCompanies(response.data);
     })
       
   


        
    const fetchItems = async () => {
  
      
      const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/batches/getBatchesPaginated`, {
        params: {
          searchTerm,
          company: category,
          requestype: brand,
          status:statut,
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
  }, [searchTerm, category, brand, currentPage,sortString, itemsPerPage, statut]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleCategoryChange = (event) => {
  
    if(event.target.value === "Tous"){
      
       setCategory(null)
    }
    else{
      setCategory(event.target.value);
    }
  
    setCurrentPage(0);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
    setCurrentPage(0);
  };

  const handleStatutChange = (event) => {
    setStatut(event.target.value);
    setCurrentPage(0);
  };

  return (
   
    <div >
       
        <div style={{display: "flex",justifyContent: "space-between", alignItems: "center", padding:`${isMobile ? '70px 10px' : '10px 30px'}` , backgroundColor: 'white' }}>
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
        
        <Form.Select  aria-label="Default select example" onChange={handleCategoryChange}>
        <option value="">Toutes</option>
      {companies?.map(el => (
        <option value={el.id}>{el.nomSociete} </option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleBrandChange}>
    <option value=''>Type de lot: Tous</option>
    <option value='Add_Box'>Type de lot: ADD BOXES</option>
    <option value='Box_Request'>Type de lot: BOXES REQUEST</option>
    <option value='Box_Return'>Type de lot: BOXES RETURN</option>
    <option value='Box_Shredding'>Type de lot: BOXES SHREDDING</option>
     
    </Form.Select>

    <Form.Select onChange={handleStatutChange}  aria-label="Default select example">
    <option value=''>Statut de lot: Tous</option>
    <option value='pending'>En attente </option>
    <option value='processing'>En cours de traitement</option>
    <option value='terminated'>Traités</option>
     
    </Form.Select>
        </div>
        </Offcanvas.Body>
      </Offcanvas>
        </div> : 
        <div>
          <h5 style={{color:'#0243cd'}}>Filtrage:</h5>
          <div style={{display: "flex", gap:'5px', alignItems:'center', justifyContent: 'center', border :'1px solid #0243cd', borderRadius :'5px', padding:'15px'}}>
        
       

          <Form.Select  aria-label="Default select example" onChange={handleCategoryChange}>
      <option value="">Société: Toutes</option>
      {companies?.map(el => (
        <option value={el.id}>{el.nomSociete} </option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleBrandChange}>
    <option value=''>Type de lot: Tous</option>
    <option value='Add_Box'>Type de lot: ADD BOXES</option>
    <option value='Box_Request'>Type de lot: BOXES REQUEST</option>
    <option value='Box_Return'>Type de lot: BOXES RETURN</option>
    <option value='Box_Shredding'>Type de lot: BOXES SHREDDING</option>
     
    </Form.Select>
    <Form.Select onChange={handleStatutChange}  aria-label="Default select example">
    <option value=''>Statut de lot: Tous</option>
    <option value='pending'>En attente </option>
    <option value='processing'>En cours de traitement</option>
    <option value='terminated'>Traités</option>
     
    </Form.Select>
        </div>
        </div>
        
        }
        
        
          <div>
          <InputGroup  >
        <InputGroup.Text id="basic-addon1">{searchIco}</InputGroup.Text>
        <Form.Control
        value={searchTerm} onChange={handleSearch}
          placeholder="rechercher un lot"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
          </div>
          
        </div>

      <hr />
    
      {loading === true ? <div style={{display: 'flex',justifyContent:'center',paddingTop:"100px"}}><Spinner animation="border"  variant="primary" /> </div> : items.length !== 0  ? 
        <div style={{borderRadius:"10px",  margin:"auto", backgroundColor:"white", color:"#0243cd", marginBottom:"30px",marginTop:"40px", padding:'30px'}}>
            
            <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'20px'}}>
        <Form.Select style={{width:'200px'}} onChange={(e)=> {setItemsPerPage(e.target.value); setCurrentPage(0)}
        } aria-label="Default select example">
    <option value='10'>10</option>
    <option value='25'>25</option>
    <option value='50'>50</option>
    <option value='100'>100</option>
     
    </Form.Select>
    </div >
            <Table style={{borderRadius:"10px", width:"100%", margin:"auto"}} responsive>
     
            <thead style={{height:"80px", fontSize:"15px"}}>
       <tr>
       <th style={{fontWeight:"600"}}>Type de requête</th>
       <th style={{fontWeight:"600"}}>Nombre de boites </th>
       <th style={{fontWeight:"600"}}>Date de création</th>
       <th style={{fontWeight:"600"}}>Statut</th>
       <th style={{fontWeight:"600"}}>Numéro de suivi</th>
       <th style={{fontWeight:"600"}}>Société </th>
       <th style={{fontWeight:"600"}}>Consulter</th>
       <th style={{fontWeight:"600"}}>Gérer</th>
       </tr>
     </thead>
     <tbody style={{color: "black", fontSize: "14px"}}>
       {items.length > 0 ? items.map((el,id)=>{
     return (
      <tr key={id}>
          <td>{el.requestType}</td>
          <td>{el.nbrBoites}</td>
          <td>{el.creationDate}</td>
          <td>{el.statutLots.sort((a, b) => new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime())[0].statut.batchStatus.toString()}</td>
          <td>{el.id}</td>
          <td>{el?.boxes[0]?.provenance?.company?.nomSociete}</td>
         
      

       <td><Button v style={{height:"auto", backgroundColor:"#0243cd"}} variant="primary">
       <Link style={{textDecoration:"none", color: "white"}}  to={`/Admin/demandes/${el?.boxes[0]?.provenance?.company?.id}/${el.id}`}>{infoIco}</Link>
      </Button></td>   
    <td> 
     {MatchTreatement(el)}
     
    </td>
       </tr>
     )  
       } 
       
       )
       :
       
       <tr>fin des résultats</tr>
       }
       
     </tbody>

  </Table>
  <br />
  <Pagination
    page={currentPage}
    totalPages={totalPages}
    onPageChange={handlePageChange}
  />
   </div> :  <NoResults/>}
  
  
  </div>


  )
    }

  export default  GestionUsers