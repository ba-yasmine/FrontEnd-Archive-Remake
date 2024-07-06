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
import {TbBuildingFactory, TbActivity} from "react-icons/tb";
import "./styleMenu.css"


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
      icon: <TbBuildingFactory style={{fontSize: '30px'}}/>, name: 'Accueil', link: `/Coordinateur/Accueil`
     }, {
      icon: <TbBuildingFactory style={{fontSize: '30px'}}/>, name: 'Gérer lots', link: `/Coordinateur/demandes`
     }, {
      icon: <TbActivity style={{fontSize: '30px'}}/>, name: "Gérer boites", link: `/Coordinateur/boxes`
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

 
//Add styleMenu
    return (<div>
        <nav className="sidebar">
            <header>
                <div className="image-text">
                <span className="image">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#4CAF50',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: '#fff' ,
                        fontFamily: "Poppins",
                        fontWeight:"600"
                    }}>
                     {userAuth.email ? userAuth.email.substring(0, 2).toUpperCase() : "N/A"}
                  </div>
                </span>
                    <div className="text bx-menu-alt">
                        <span className="name">Menu</span>
                    </div>
                </div>
            </header>


            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                          <li className="nav-link">
                             <NavLink to="/Coordinateur/Accueil">
                             <i className="bx bx-home-alt icon"></i>
                             <span className="text nav-text">Accueil</span>
                             </NavLink>
                          </li>
                        <li className="nav-link">
                            <NavLink to="/Coordinateur/demandes">
                                <i className="bx bx-package icon"></i>
                                <span className="text nav-text">Gérer lots</span>
                            </NavLink>
                        </li>
                        <li className="nav-link">
                            <NavLink to="/Coordinateur/boxes">
                                <i className="bx bx-box icon"></i>
                                <span className="text nav-text">Gérer boites</span>
                            </NavLink>
                        </li>


                    </ul>
                </div>
                   <div className="bottom-content">

                    <li >
                        <a id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false" >
                            <i className='bx bx-user icon'></i>
                            <span className="text nav-text">Profil</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-light text-small shadow position-absolute" aria-labelledby="dropdownUser1" style={{width:"245px"}}>
                            <li >
                                <a  onClick={() =>navigate("/Coordinateur/profileDetails")}  className="dropdown-item" href="#">Mon profil</a>
                            </li>

                            <li>
                                 <a  onClick={logout} className="dropdown-item" href="#">Se déconnecter</a>
                            </li>
                         </ul>
                     </li>
                </div>

            </div>
        </nav>




    </div>)
}

export default NavBarCoordinateur