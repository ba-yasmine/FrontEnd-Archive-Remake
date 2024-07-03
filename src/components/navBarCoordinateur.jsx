import React, { useState, useEffect,useContext } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link ,NavLink, useNavigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "../App"
import { BiHomeAlt, BiBox} from "react-icons/bi";
import { MdOutlineBatchPrediction} from "react-icons/md";
import "../pages/Administrateur/style.css"
import {FiMenu} from "react-icons/fi"

const NavBarCoordinateur = () => {
  function deleteCookie() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  const {userAuth,setUserAuth} = useContext(UserContext);
  let navigate =useNavigate()
  const [isMobile, setIsMobile] = useState(false);
  const [show, setShow] = useState(false);
  const barsIco = <FontAwesomeIcon style={{color:'#0243cd'}} icon={faBars}/>
  const userProfil = <FontAwesomeIcon style={{color:'#0243cd'}} size='2x'  icon={faUser}/>
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [navData, setNavData] = useState([

    {
      icon: <BiHomeAlt  style={{fontSize:'30px'}}/>,
      name:'Accueil',
      link:`/Coordinateur/Accueil`
    },
    {
      icon: <MdOutlineBatchPrediction  style={{fontSize:'30px'}}/>,
      name:'Gérer lots',
      link:`/Coordinateur/demandes`
    },
    {
      icon: <BiBox  style={{fontSize:'30px'}}/>,
      name:'Gérer boites',
      link:`/Coordinateur/boxes`
    }

  ]);

 
  const logout=()=> {
    
    deleteCookie();
    setUserAuth({
      role: ['DefaultRole']
    } )
    navigate('/')
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

 
 
  return (
    
   
    <div className="container-fluid" style={{ backgroundColor: 'white' , color:'#33475a',overflowY:'hidden', zIndex:"9900"  }}>
    <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 ">
            <div className="d-flex flex-column  align-items-sm-start  pt-2 text-white min-vh-100 w-100">
             
                <ul className="nav nav-pills flex-column mb-auto mb-0  align-items-sm-start" id="menu">
               
                <h4 style={{width:"150px",marginRight:"10px", color:"#0243cd"}}  className="d-flex align-items-center pb-3 mb-md-0 me-md-auto mt-2  text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline"><FiMenu/> Menu</span>
                </h4>
                   
                   { navData.map((el, idx) =>
                    
                    <NavLink key={idx}
                   to={el.link}
                   style={({ isActive, isPending }) => {
                    return {
                      backgroundColor: isActive ? "#0243cd" : "white",
                      color: isActive ? "white" : "#0243cd",
                      borderRadius:'7px',
                      textDecoration:'none',
                      marginTop:'30px',
                      paddingTop:'8px',
                      paddingBottom:'8px',
                      paddingLeft:'3px',
                      width:'100%',
                      
                      
                    
                    };
                   }}
                      id="navLink">
                <h5> {!isMobile ? el.name : el.icon} </h5>
                 </NavLink>
                           )
                 
                 }
                   
                
                  
                
                  
                    
                </ul>
                
                <div className="dropdown pb-4" style={{position:"absolute", bottom:"0"}}>
                    <a  className="d-flex align-items-center  text-decoration-none " id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                       
                        <span className="mx-1">{userProfil}</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-light text-small shadow position-absolute" aria-labelledby="dropdownUser1">
                        <li >
                        <a  onClick={() =>navigate("/Coordinateur/profileDetails")} className="dropdown-item" href="#">Mon profil</a>
                        </li>
                        <li>
                            
                        </li>
                        <li>
                          <a  onClick={logout} className="dropdown-item" href="#">se déconnecter</a>
                          
                          </li>
                    </ul>
                </div>
            </div>
        </div>
      
    </div>
</div>
  )
}

export default NavBarCoordinateur