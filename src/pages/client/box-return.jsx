import React, { useState, useEffect,useContext,createContext } from 'react';
import axios from 'axios';
import Pagination from '../../components/paginationComponent';
import {UserContext} from "../../App"
import Spinner from 'react-bootstrap/Spinner';
import PanierBoxReturn from "./PanierBoxReturn"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import {headerTitleContext} from '../../Layout/layout'
import NoResults from '../../components/noResultsFound'
import { BsFilterSquare} from "react-icons/bs";


export const PanierReturn = createContext();
const BoxReturn = () => {
 

  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
  const [departementList,setDepartementList] = useState([])
  const [isMobile, setIsMobile] = useState(false);
  const searchIco = <FontAwesomeIcon style={{color:'#0243cd'}} icon={faSearch}/>
  const [loading,isLoading] = useState(true);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [company, setcompany] = useState();
  const [departement, setdepartement] = useState('');
  const [location, setLocation] = useState('');
  const [itemsPerPage,setItemsPerPage] = useState(10)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fullDescription,setFullDescription] = useState("")
  const [sortString, setSortString] = useState('')
  const fulldescription = <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter}/>
  const [selectionRequest,setSelectionRequest] = useState([])
const removeBox = <FontAwesomeIcon size="1x" style={{color:"#cb1c06"}} icon={faCircleXmark}/>
const [provenance, setprovenance] =useState([]);
const [selectedProventreetrance, selectedProvenance2] = useState();

useEffect(() => {
  setheaderTitle('Demande Boxes-Return')
  setheaderArrow(true)
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
    const getProvenancesPromise = axios.get(`${process.env.REACT_APP_HOST_VAR}rest/provenance/getProvenances/${userAuth.company}`, {
      headers: {
        'Authorization':  "Bearer" + userAuth.token
      }
    });
  
    const getDepartementsPromise = axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getDepartements/${userAuth.ID}`, {
      headers: {
        'Authorization': "Bearer" + userAuth.token
      }
    });
  
    Promise.all([getProvenancesPromise, getDepartementsPromise])
      .then(([provenancesResponse, departementsResponse]) => {
        setprovenance(provenancesResponse.data);
        const departementList = departementsResponse.data;
        const provid=provenancesResponse.data[0].id
        setDepartementList(departementList);
        selectedProvenance2(provid)
        const fetchItems = async (idarr) => {
          const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/boxes/getBoxesPaginatedClientRequest`, {
            params: {
              deplist: [...idarr].join(','),
              searchTerm,
              company: userAuth.company,
              departement: departement,
              provenance:provid,
              location: 'At_Customer',
              sortString,
              page: currentPage,
              size: itemsPerPage,
            },
            headers: { 'Authorization': "Bearer" + userAuth.token }
          });
          isLoading(false);
          setItems(response.data.content);
          setTotalPages(response.data.totalPages);
        };
        fetchItems(departementList.map(obj => obj.id));
      })
      .catch(error => {
      
      });
  }, []);
  
  useEffect(() => {
    if (selectedProventreetrance != null) {
     
      const fetchItems = async (idarr) => {
        const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/boxes/getBoxesPaginatedClientRequest`, {
          params: {
            deplist: [...idarr].join(','),
            searchTerm,
            company: userAuth.company,
            departement: departement,
            provenance: selectedProventreetrance,
            location: 'At_Customer',
            sortString,
            page: currentPage,
            size: itemsPerPage,
          },
          headers: { 'Authorization': "Bearer" + userAuth.token }
        });
        isLoading(false);
        setItems(response.data.content);
        setTotalPages(response.data.totalPages);
        let selectedIds = selectionRequest.map (el => {return el.id});
  
        // Use the then block to set the checkbox state
        let newItems = response.data.content.map(el => {
          if (selectedIds.includes(el.id)) {
            el["isChecked"] = true;
          } else {
            el["isChecked"] = false;
          }
          return el; // Don't forget to return the modified element
        });
        setItems(newItems);
      };
      fetchItems(departementList.map(obj => obj.id));
    }
  }, [searchTerm, company, departement, currentPage, sortString, location, itemsPerPage, selectedProventreetrance])
  
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleDepartementChange = (event) => {
   
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
  const changeStatut = (ID) => {
    items.map(el =>
      {if(el.id === ID)
        {
          if(el['isChecked'] === false) {
          el['isChecked'] = true
        }
        else if (el['isChecked'] === true)
         {
          el['isChecked'] = false
         }
      
      }
      })

   
      
  }
  function remove(el) {
         
    changeStatut(el.id);
    setSelectionRequest(selectionRequest.filter(item =>{ return item.id !== el.id}  ));
    
  }
  return (
    <div >
   
    <div style={{backgroundColor:'white', padding:'10px'}}>
       
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
    
   

    <Form.Select onChange={(e)=>{setSelectionRequest([]); selectedProvenance2(e.target.value);}  } defaultValue={selectedProventreetrance} aria-label="Floating label select example">
    
    {provenance?.map((el,id)=>{
     
     return <option key={id} value={el.id}>Provenance: {el.adresse}</option>
    })
    }
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
      {departementList?.map(el => (
        <option value={el.id}>Département {el.nom}</option>
      ))}
     
    </Form.Select>
    
   

    
      <Form.Select onChange={(e)=>{setSelectionRequest([]); selectedProvenance2(e.target.value);}  } defaultValue={selectedProventreetrance} aria-label="Floating label select example">
    
     {provenance?.map((el,id)=>{
      
      return <option key={id} value={el.id}>Provenance: {el.adresse}</option>
     })
     }
      </Form.Select>

        </div>
        </div>
        
        }
        
        
          <div>
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
        <div style={{borderRadius:"10px", width:"95%", margin:"auto", backgroundColor:"white", color:"#0243cd", marginBottom:"30px",marginTop:"40px"}}>
        <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'20px'}}>
        <Form.Select style={{width:'200px'}} onChange={(e)=> setItemsPerPage(e.target.value)} aria-label="Default select example">
    <option value='10'>10</option>
    <option value='25'>25</option>
    <option value='50'>50</option>
    <option value='100'>100</option>
     
    </Form.Select>
    <div >
<PanierReturn.Provider value={{selectionRequest,setSelectionRequest}}>
<PanierBoxReturn provenanceId={selectedProventreetrance}  />
</PanierReturn.Provider>
   </div>
        </div>
        <Table style={{color:"rgb(2, 67, 205)", margin:"auto",width:"80vw", marginTop:'30px'}} responsive>
        
         <thead style={{height:"50px", backgroundColor:"#f2f6fe" , fontSize:"17px"}}>
        <tr>
        <th>Code à barre </th>
          <th  style={{fontWeight:"600"}}>Description </th>
          <th  style={{fontWeight:"600"}}>Société </th>
          <th  style={{fontWeight:"600"}}>Emplacement</th>
          <th  style={{fontWeight:"600"}}>Provenance</th>
          <th  style={{fontWeight:"600"}}>Choisir</th>
        </tr>
      </thead>
      <tbody>
   
      { items.map((el,id)=>{
      return (
       <tr key={id}>
         <td>{el.codeBarre}</td>
          <td >{el.description.length > 200 ? <div>{el.description.slice(0,150)+" ..."} <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
    <Button style={{border:"none", background:"none", color:"#0243cd"}} variant="success" onMouseEnter={()=>setFullDescription(el.description)}>{fulldescription}</Button>
  </OverlayTrigger></div>  : el.description}  </td>
         <td>{el.provenance.company.nomSociete}</td>
          <td>{el.location}</td>
          <th>{el.provenance.adresse}</th>
          {el.isChecked === true ? <td  ><Button variant="danger" style={{border:"none", background:"none", color:"#0243cd"}} onClick={()=> {remove(el);}}>{removeBox}</Button>   </td> :
           <td><Form.Check style={{width:"40px"}} onClick={(e)=>{if(e.target.checked){setSelectionRequest([...selectionRequest,el]);changeStatut(el.id);} else {remove(el);} } } type="checkbox" name="" id="" /></td>
          }
          
        </tr>
      )  
        })}
        
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

  export default  BoxReturn