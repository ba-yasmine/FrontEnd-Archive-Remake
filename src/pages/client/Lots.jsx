import React, { useState, useEffect,useContext, useRef } from 'react';
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
import { Link } from "react-router-dom";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons' 
import {headerTitleContext} from '../../Layout/layout'
import NoResults from '../../components/noResultsFound'
import { BsFilterSquare} from "react-icons/bs";

const ITEMS_PER_PAGE = 10;

const LotsClient = () => {
  const inputElement = useRef();
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
  const [sortString, setSortString] = useState('')
  const sortIco = <FontAwesomeIcon icon={faSort}/>
  const [statut, setStatut] = useState('');
  const infoIco = <FontAwesomeIcon size='lg' icon={faCircleInfo}/>

  useEffect(() => {

    setheaderTitle('Lots')
    setheaderArrow(false)
  })


function scroll(){
  window.screenTop()
}

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

    
   


        
    const fetchItems = async () => {
  
      
      const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/batches/getBatchesCustomerPaginated`, {
        params: {
          searchTerm,
          company: userAuth.company,
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
  
    setCategory(event.target.value);
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
   
    <div   ref={inputElement}
    >
   
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
    <option value='terminated'>Traites</option>
     
    </Form.Select>
        </div>
        </Offcanvas.Body>
      </Offcanvas>
        </div> : 
        <div>
          <h5 style={{color:'#0243cd'}}>Filtrage:</h5>
          <div style={{display: "flex", gap:'5px', alignItems:'center', justifyContent: 'center', border :'1px solid #0243cd', borderRadius :'5px', padding:'15px'}}>
        
       

    
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
    <option value='terminated'>Traites</option>
     
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
        <div style={{borderRadius:"10px", width:"95%", margin:"auto", backgroundColor:"white", color:"#0243cd", marginBottom:"30px",marginTop:"40px"}}>
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
         
        
       <th style={{fontWeight:"600"}}>Type de demande</th>
       <th style={{fontWeight:"600"}}>Date de création</th>
       <th style={{fontWeight:"600"}}>Statut </th>
       <th style={{fontWeight:"600"}}>Nombre de boites </th>
       <th style={{fontWeight:"600"}}>Numero de suivis</th>
       <th style={{fontWeight:"600"}}>Infos</th>
       <th style={{fontWeight:"600"}}>Suivis</th>
       
       </tr>
     </thead>
     <tbody style={{color:"black", fontSize: "14px"}}>
       {items.length > 0 ? items.map((el,id)=>{
     return (
      <tr key={id}>
      
         
          <td>{el.requestType}</td>
          <td>{el.creationDate}</td>
          <td>{el.statutLots.sort((a, b) => new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime())[0].statut.batchStatus.toString()}</td>
          <td>{el.nbrBoites}</td>
          <td>{el.id}</td>
          <td><Button style={{backgroundColor:'white', border:'none' }}  variant="primary"><Link style={{textDecoration:"none", color: "#0243cd"}}  to={`/Client/Demandes/demandesLookup/${el.id}/${userAuth.company}`}>{infoIco}</Link> </Button></td>
          <td><Button style={{backgroundColor:'#0243cd', border:'none',  }}  variant="primary"><Link style={{textDecoration:"none", color:'white'}}  to={`/Client/Lot/${userAuth.company}/${el.id}/suivitlot`}>suivre</Link> </Button></td>
       </tr>
     )  
       } 
       
       )
       :
       
       <tr style={{textAlign:"center", width:"100%"}}>Fin des resultats</tr>
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
</div>

  )
    }

  export default  LotsClient