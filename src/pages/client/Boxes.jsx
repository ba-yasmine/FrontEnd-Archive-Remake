import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/paginationComponent';
import {UserContext} from "../../App"
import Spinner from 'react-bootstrap/Spinner';
import NavBar from "../../components/NavbarClient"
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
import AjoutBox from '../Coordinateur/AjouterBox'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import BoxHistory from '../Coordinateur/BoxHistory';
import {headerTitleContext} from '../../Layout/layout'
import NoResults from '../../components/noResultsFound'
import { BsFilterSquare} from "react-icons/bs";

const BoitesClient = () => {
 
 
  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
  const [departementList,setDepartementList] = useState([])
  const [isMobile, setIsMobile] = useState(false);
  const searchIco = <FontAwesomeIcon style={{color:'#0243cd'}} icon={faSearch}/>
  const [loading,isLoading] = useState(true);
  const {userAuth} = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [company, setcompany] = useState();
  const [departement, setdepartement] = useState('');
  const [location, setLocation] = useState('');
  const [provenances,setProvenances] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullDescription,setFullDescription] = useState("")
  const [sortString, setSortString] = useState('')
  const [provenance,setProvenance] = useState()
  const fulldescription = <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter}/>
  const [itemsPerPage,setItemsPerPage] = useState(10)

  const popover = (
    <Popover style={{fontSize:"15px"}} id="popover-basic">
    <Popover.Header style={{color: "#0243cd"}} as="h3">Description complète:</Popover.Header>
    <Popover.Body style={{color: "#0243cd"}}>
     {fullDescription}
    </Popover.Body>
  </Popover>
  )


  useEffect(() => {
    setheaderTitle('Boites')
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
    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${userAuth.company}`,{headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{
      
     setProvenances(response.data)
    }
   
        ).catch((err) => {
       
          
        })

    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getDepartements/${userAuth.ID}`, {
      headers: {
        'Authorization': "Bearer" + userAuth.token
      }
    })
      .then((response) => {
      
        setDepartementList(response.data);
      
  
        const fetchItems = async (idarr) => {
          
           
          const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/boxes/getBoxesPaginatedClient`, {
            params: {
              deplist: [...idarr].join(','),
              searchTerm,
              company: userAuth.company,
              departement: departement,
              location: location,
              provenance:provenance,
              sortString,
              page: currentPage,
              size: itemsPerPage,
            },
            headers: { 'Authorization': "Bearer" + userAuth.token }
          });
  
          
          isLoading(false)
          setItems(response.data.content);
          setTotalPages(response.data.totalPages);
        };
  
        fetchItems(response.data.map(obj => obj.id))
      })
      .catch(error => {
        
      });
  
  }, [searchTerm, company, departement, currentPage, sortString, location, itemsPerPage, provenance]);
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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

  return (
    <div >
   
 
    <div >
       
        <div style={{display: "flex",justifyContent: "space-between", alignItems: "center", padding:`${isMobile ? '70px 10px' : '10px 30px'}`}}>
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
        
        <Form.Select  aria-label="Default select example" onChange={handledepartementChange}>
      <option value=''>Tous</option>
      {departementList?.map(el => (
        <option value={el.id}>{el.nom}</option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleLocationChange}>
    <option value=''>Localisation: Tous</option>
    <option value='At_Warehouse'>Localisation: à l'entrepôt </option>
    <option value='At_Customer'>Localisation: chez le client</option>
    <option value='Pending'>Localisation: en attente</option>
     
    </Form.Select>

    <Form.Select aria-label="Default select example">
    <option value=''>Type de demande: Tous</option>
    <option value='Add_Box'>Type de demande: ADD BOXES</option>
    <option value='Box_Request'>Type de demande: BOXES REQUEST</option>
    <option value='Box_Return'>Type de demande: BOXES RETURN</option>
     
    </Form.Select>
    <Form.Select
    onChange={(e)=> setProvenance(e.target.value)}
    aria-label="Default select example">
   <option value=''>Provenance: toutes</option>
   {provenances?.map((el,id)=>{
    return  <option key={id} value={el.id}>Provenance{el.adresse}</option>
   })}
     
    </Form.Select>
        </div>
        </Offcanvas.Body>
      </Offcanvas>
        </div> : 
        <div>
          <h5 style={{color:'#0243cd'}}>Filtrage:</h5>
          <div style={{display: "flex", gap:'5px', alignItems:'center', justifyContent: 'center', border :'1px solid #0243cd', borderRadius :'5px', padding:'15px'}}>
        
       

       <Form.Select  aria-label="Default select example" onChange={handledepartementChange}>
      <option value=''>Département Tous</option>
      {departementList?.map((el,id) => (
        <option key={id} value={el.id}>Département {el.nom}</option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleLocationChange}>
    <option value=''>Localisation: Tous</option>
    <option value='At_Warehouse'>Localisation: à l'entrepôt </option>
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
        <div style={{borderRadius:"10px", width:"95%", margin:"auto", backgroundColor:"white", color:"#0243cd",  marginBottom:"30px",marginTop:"40px"}}>
          
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
     
            <thead style={{backgroundColor:"#f8f9fa",height:"50px" , fontSize:"15px"}}>
       <tr style={{borderRadius:"5px",margin:"auto",paddingTop:"15px"}}>
         
       <th style={{fontWeight:"600"}}>Code à barre </th>
       <th style={{fontWeight:"600"}}>Description  </th>
       <th style={{fontWeight:"600"}}>Société  </th>
       <th style={{fontWeight:"600"}}>Département </th>
       <th style={{fontWeight:"600"}}>Emplacement  </th>
       <th style={{fontWeight:"600"}}>Date de création</th>
      
       <th>Historique</th>
       </tr>
     </thead>
     <tbody style={{color:"black", fontSize: "14px"}}>
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
    : <p>Non Trouvée</p>
  }
</td>

          <td>{el.provenance.company.nomSociete}</td>
          <td>{el.departements ? el.departements.nom : "non assigné"}</td>
          <td>{el.location}</td>
          <td>{el.createDate}</td>
          <td><BoxHistory boxInfos={el}/></td>
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
   </div>
    


  )
    }

  export default  BoitesClient