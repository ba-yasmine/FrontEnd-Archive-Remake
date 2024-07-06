import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/paginationComponent';
import {UserContext} from "../../App"
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { faSort } from '@fortawesome/free-solid-svg-icons'
import {headerTitleContext} from '../../Layout/layout'
import NoResults from '../../components/noResultsFound'
import { BsFilterSquare} from "react-icons/bs";
import {TbFileExport} from "react-icons/tb"

const GestionLogs = () => {
 
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
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [companies,setCompanies] = useState([])
  const [roles,setRoles] = useState([])
  const [Export, setExport] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sortString, setSortString] = useState('')
  const sortIco = <FontAwesomeIcon icon={faSort}/>


  useEffect(() => {
    setheaderTitle("Logs d'activités")
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

    if(Export === true) {
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/activity/getUserLogsFile`, {
        params: {
          searchTerm,
          company: category,
          role: brand,
          month:month,
          sortString,
        },
        headers: {
          'Authorization': "Bearer " + userAuth.token
        },
        responseType: 'blob' // specify the response type as blob
      }).then((response) => {
        setExport(false)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'activity_logs.xlsx'); // set the filename
        document.body.appendChild(link);
        link.click();
      });
      

    }

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
      
      const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/activity/getUserLogsPaginated`, {
        params: {
          searchTerm,
          company: category,
          role: brand,
          month:month,
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
  }, [searchTerm, category, brand, currentPage,sortString, itemsPerPage, month,Export]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleCompanyChange = (event) => {
  
    setCategory(event.target.value);
    setCurrentPage(0);
  };

  const handleRoleChange = (event) => {
    setBrand(event.target.value);
    setCurrentPage(0);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value.slice(5));
    setCurrentPage(0);
  };

  const handleExportChange = () => {
    setExport(!Export);
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
    <Form.Control type="month"  onChange={handleMonthChange} />
        </div>
        </Offcanvas.Body>
      </Offcanvas>
        </div> : 
        <div>
          <h5 style={{color:'#0243cd'}}>Filtrage:</h5>
          <div style={{display: "flex", gap:'5px', alignItems:'center', justifyContent: 'center', border :'1px solid #0243cd', borderRadius :'5px', padding:'15px'}}>
        
       

        <Form.Select  aria-label="Default select example" onChange={handleCompanyChange}>
      <option value=''>Société: Tous</option>
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
    {/* <Form.Control type="month"  onChange={handleMonthChange} /> */}
        </div>
        </div>
        
        }
        
        
          <div>
          <InputGroup  >
        <InputGroup.Text id="basic-addon1">{searchIco}</InputGroup.Text>
        <Form.Control
        value={searchTerm} onChange={handleSearch}
          placeholder="rechercher un log"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
          </div>
          
        </div>
        
     
      <hr />
    
      {loading === true ? <div style={{display: 'flex',justifyContent:'center',paddingTop:"100px"}}><Spinner animation="border"  variant="primary" /> </div> : items.length !== 0  ? 
        <div style={{borderRadius:"10px", width:"95%", margin:"auto", backgroundColor:"white", color:"#0243cd", marginBottom:"30px",marginTop:"40px"}}>
           <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'20px', gap:"10px"}}>
             <Form.Select style={{width:'200px'}} onChange={(e)=> {setItemsPerPage(e.target.value); setCurrentPage(0)}
        } aria-label="Default select example">
    <option value='10'>10</option>
    <option value='25'>25</option>
    <option value='50'>50</option>
    <option value='100'>100</option>
     
    </Form.Select>
  <Button onClick={()=>handleExportChange()}
  style={{backgroundColor: 'white', border:'2px solid green', color:'green', paddingLeft:'20px', paddingRight:'20px', display:'flex', flexDirection:'row', width:'auto', paddingTop:"4px", paddingBottom:"2px"}}> <p style={{fontWeight:'600'}}>Exporter</p>   <TbFileExport style={{fontSize:'30px',marginLeft:'5px' }}/></Button>
    </div >
            
            <Table style={{borderRadius:"10px", width:"100%",margin:"auto"}} responsive>
     
            <thead style={{height:"60px", fontSize:"17px"}}>
      <tr>

       
        <th style={{fontWeight:"600"}}>Nom d'utilisateur<button style={{border:"none", background:"none", color:"#0243cd"}}  ></button></th>
        <th style={{fontWeight:"600"}}>Date de l'action<button style={{border:"none", background:"none", color:"#0243cd"}}  ></button></th>
        <th style={{fontWeight:"600"}}>Description de l'action<button style={{border:"none", background:"none", color:"#0243cd"}} ></button></th>
        <th style={{fontWeight:"600"}}>Société<button style={{border:"none", background:"none", color:"#0243cd"}}  ></button></th>
        <th style={{fontWeight:"600"}}>Rôle<button style={{border:"none", background:"none", color:"#0243cd"}}  ></button></th>
        
       
      </tr>
    </thead>
    <tbody>
      {items.length > 0 ? items.map((el,id)=>{
    return (
     <tr key={id}>
     
        <td>{el.user.name}</td>
        <td>{el.createdate}</td>
        <td>{el.description}</td>
        <td>{el.user.company?.nomSociete}</td>
        <td>{el.user.roles[0].name}</td>
        
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
</div>

  )
    }

  export default  GestionLogs