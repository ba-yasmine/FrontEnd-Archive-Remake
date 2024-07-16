import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { BiHomeAlt, BiBox } from 'react-icons/bi';
import { MdOutlineBatchPrediction } from 'react-icons/md';
import { AiOutlineContacts } from 'react-icons/ai';
import { TbBuildingFactory, TbActivity } from 'react-icons/tb';
import './styleMenu.css';

const NavbarClient = () => {

    const deleteCookie = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    const { userAuth, setUserAuth } = useContext(UserContext);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navData = [
        {
            icon: <TbBuildingFactory style={{ fontSize: '30px' }} />,
            name: 'Accueil',
            link: `/Client/Accueil/${userAuth.ID}/${userAuth.company}`,
        },
        {
            icon: <TbActivity style={{ fontSize: '30px' }} />,
            name: 'Boites',
            link: `/Client/Boxes/${userAuth.ID}/${userAuth.company}`,
        },
        {
            icon: <TbActivity style={{ fontSize: '30px' }} />,
            name: 'Lots',
            link: `/Client/Demandes/${userAuth.ID}/${userAuth.company}`,
        },
        {
            icon: <TbActivity style={{ fontSize: '30px' }} />,
            name: 'Contact',
            link: '/Contact',
        },
    ];

    const logout = () => {
        deleteCookie();
        setUserAuth({ role: ['DefaultRole'] });
        navigate('/');
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1205);
        };

        handleResize(); // Check initial size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="sidebar">
            <header>
                <div className="image-text">
                    <span className="image">
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'rgb(235, 209, 16)',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                color: '#fff',
                                fontFamily: 'Poppins',
                                fontWeight: '600',
                            }}
                        >
                            {userAuth.email ? userAuth.email.substring(0, 2).toUpperCase() : 'N/A'}
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
                                   <NavLink to="/Client/Accueil/${userAuth.ID}/${userAuth.company}">
                                       <i className="bx bx-home-alt icon"></i>
                                       <span className="text nav-text">Accueil</span>
                                   </NavLink>
                               </li>
                               <li className="nav-link">
                                   <NavLink to="/Client/Boxes/${userAuth.ID}/${userAuth.company}">
                                       <i className="bx bx-box icon"></i>
                                       <span className="text nav-text">Boites</span>
                                   </NavLink>
                               </li>
                               <li className="nav-link">
                                   <NavLink to="/Client/Demandes/${userAuth.ID}/${userAuth.company}">
                                       <i className="bx bx-package icon"></i>
                                       <span className="text nav-text">Lots</span>
                                   </NavLink>
                               </li>
                                    <li className="nav-link">
                                      <NavLink to="/Contact">
                                      <i className="bx bx-user-pin icon"></i>
                                      <span className="text nav-text">Contact</span>
                                     </NavLink>
                               </li>
                           </ul>
                </div>
                <div className="bottom-content" style={{cursor: "pointer"}}>

                          <li >
                           <a id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false" >
                               <i className='bx bx-user icon'></i>
                               <span className="text nav-text">Profil</span>
                           </a>
                           <ul className="dropdown-menu dropdown-menu-light text-small shadow position-absolute" aria-labelledby="dropdownUser1" style={{width:"245px"}}>
                               <li >
                                   <a  onClick={() =>navigate("/UserProfile")}  className="dropdown-item" href="#">Mon profil</a>
                               </li>

                               <li>
                                   <a  onClick={logout} className="dropdown-item" href="#">Se déconnecter</a>

                               </li>
                           </ul>
                       </li>
               </div>
            </div>
        </div>
    );
};

export default NavbarClient;
