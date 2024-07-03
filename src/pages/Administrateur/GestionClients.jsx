import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/paginationComponent';
import {UserContext} from "../../App"
import Spinner from 'react-bootstrap/Spinner';
import NavAdmin from '../../components/NavbarAdmin'
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import ModifierClient from '../Administrateur/ModifierClient'
import ChangerMotdePasse from './ChangeUserPassword'
import BlockUser from '../../components/BlockUser.jsx'
import UserDeps from './gererDepartements'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import {headerTitleContext} from '../../Layout/layout'
import NoResults from '../../components/noResultsFound'
import { BsFilterSquare} from "react-icons/bs";
import AjouterClient from "./AjoutClient"
const ITEMS_PER_PAGE = 10;

const GestionUsers = () => {
 
  const [itemsPerPage,setItemsPerPage] = useState(10)
  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
  const [isMobile, setIsMobile] = useState(false);
  const searchIco = <FontAwesomeIcon style={{color:'#0243cd'}} icon={faSearch}/>
  const [loading,isLoading] = useState(true);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState();
  const [brand, setBrand] = useState();
  const [companies,setCompanies] = useState([])
  const [roles,setRoles] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sortString, setSortString] = useState('')
  const sortIco = <FontAwesomeIcon icon={faSort}/>
  const filterIco = <FontAwesomeIcon style={{marginLeft: "10px", }} icon={faFilter}/>

  useEffect(() => {
    setheaderTitle('Gestion utilisateurs')
    setheaderArrow(false)
  })



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 925) { // Example breakpoint for mobile
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
      setCompanies(response.data);})

    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getRoles`,{ headers:{
      'Authorization': "Bearer" + userAuth.token
    }})
    .then((response) =>{setRoles(response.data);})


        
    const fetchItems = async () => {
  
      console.log("category", category)
      const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getUsersPaginated`, {
        params: {
          searchTerm,
          company: category,
          role: brand,
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
  }, [searchTerm, category, brand, currentPage,sortString, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleCompanyChange = (event) => {
    console.log("select société :", event.target.value)
    setCategory(event.target.value);
    setCurrentPage(0);
  };

  const handleRoleChange = (event) => {
    setBrand(event.target.value);
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
        
        <Form.Select  aria-label="Default select example" onChange={handleCompanyChange}>
      <option value=''>Tous</option>
      {companies?.map(el => (
        <option value={el.id}>{el.nomSociete}</option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleRoleChange}>
    <option value=''>Tous</option>
      {roles?.map(el => (
        <option value={el.id}>{el.name}</option>
      ))}
     
    </Form.Select>
        </div>
        </Offcanvas.Body>
      </Offcanvas>
        </div> : 
        <div>
          <h5 style={{color:'#0243cd'}}>Filtrage:</h5>
          <div style={{display: "flex", gap:'5px', alignItems:'center', justifyContent: 'center', border :'1px solid #0243cd', borderRadius :'5px', padding:'15px'}}>
        
       

        <Form.Select  aria-label="Default select example" onChange={handleCompanyChange}>
      <option value=''>Société: Toutes</option>
      {companies?.map(el => (
        <option value={el.id}>Société: {el.nomSociete}</option>
      ))}
     
    </Form.Select>
    
    <Form.Select aria-label="Default select example" onChange={handleRoleChange}>
    <option value=''>Poste: Tous</option>
      {roles?.map(el => (
        <option value={el.id}>Poste: {el.name}</option>
      ))}
     
    </Form.Select>
        </div>
        </div>
        
        }
        
        
          <div>
          <InputGroup  >
        <InputGroup.Text id="basic-addon1">{searchIco}</InputGroup.Text>
        <Form.Control
        value={searchTerm} onChange={handleSearch}
          placeholder="rechercher un utilisateur"
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
    <AjouterClient/>
    </div >
            
            <Table style={{borderRadius:"10px", width:"100%", color:"#0243cd", margin:"auto"}} responsive>
     
     <thead style={{height:"80px", backgroundColor:"#f2f6fe" , fontSize:"17px"}}>
      <tr>
    <th style={{fontWeight:"600"}}>Nom<button onClick={() => setSortString('firstname')} style={{border:"none", background:"none", color:"#0243cd"}}  ></button></th>
        <th style={{fontWeight:"600"}}>Prénom<button onClick={() => setSortString('lastname')} style={{border:"none", background:"none", color:"#0243cd"}}  ></button></th>
        <th style={{fontWeight:"600"}}>Email</th>
        <th style={{fontWeight:"600"}}>Société</th>
        <th style={{fontWeight:"600"}}>Département (s)</th>
        <th style={{fontWeight:"600"}}>Rôle</th>
        <th style={{fontWeight:"600"}}>Etat</th>
        <th style={{fontWeight:"600"}}>Gestion</th>
        </tr>
        </thead>
    <tbody>
      {items.length > 0 ? items.map((el,id)=>{
    return (
     <tr key={id}>
     
        <td>{el.lastname}</td>
        <td>{el.firstname}</td>
        <td>{el.email}</td>
        <td>{el.company !== null ? el.company?.nomSociete : "CaptureDoc"}</td>
        <td> 
          { el.roles[0].name === "ROLE_CLIENT" ? el.departementsList.length === 0 ? <p style={{fontWeight: "600"}}>Aucun département</p> 
          :
          <DropdownButton  variant="Primary" style={{backgroundColor:"white", color:"#0243cd"}} title="liste départements">
          {el.departementsList?.map((el,id)=>{
             return ( 
             <Dropdown.Item key={id}> {el.nom}</Dropdown.Item>)
             }) }
         </DropdownButton>
          
         : <p style={{fontWeight:"600"}}>non concerné</p> }
       
        </td>
        <td>{el.roles[0].name}</td>
        <td>{el.statut === "AUTHORIZED" ? <p style={{color: "green", fontWeight: "600"}}>{el.statut}</p> : <p style={{color: "red", fontWeight: "600"}}>{el.statut}</p>}</td>
        
        <td> <Dropdown style={{ width:"100%", borderRadius:"5px", color:"#0243cd"}}>
     <Dropdown.Toggle style={{outline: 'none',}} variant="Primary"  drop="start">
       Gerer
     </Dropdown.Toggle>

     <Dropdown.Menu>
     
       <Dropdown.Item key={1} ><ModifierClient objecto={el} />  </Dropdown.Item>
       <Dropdown.Item key={2} ><ChangerMotdePasse email={el.email}/></Dropdown.Item>
       <Dropdown.Item key={3} ><BlockUser id={el.id} status={el.statut}/></Dropdown.Item>
        {el.company === null ? <></> :  <Dropdown.Item key={4} ><UserDeps user={el} /></Dropdown.Item>}      
     </Dropdown.Menu>
   </Dropdown></td>
      </tr>
    )  
      } 
      
      )
      :
      
      <tr>Aucun utilisateur trouvé</tr>
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

  export default  GestionUsers