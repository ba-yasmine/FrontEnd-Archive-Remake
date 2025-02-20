import React ,{useState,useContext,createContext, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import {UserContext} from "../App"
import '../pages/Administrateur/style.css'
import CustomerNavBar from "../components/NavbarClient"
import CoordinatorNavbar from "../components/navBarCoordinateur"
import AdminNavBar from "../components/NavbarAdmin"
import Header from './header'
import NotFound from '../pages/ErrorPages/NotFound';



export const headerTitleContext = createContext();
const Layout = ({ children, isBack }) => {
    const [headerTitle, setheaderTitle]= useState('')
    const [headerArrow, setheaderArrow] = useState()
    const {userAuth} = useContext(UserContext);
    const {pathname} =useLocation();


    
  
    // const match = useRouteMatch('/your-entered-route');
    
    
        if (pathname === '/' || pathname.startsWith("/PasswordChanged") || pathname.startsWith("/AccountConfirmed")){
          return  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
            {children}
            </div>
        }else if (pathname === '*'){
          // Render the 404 error component
          return <div  style={{display:"flex", justifyContent:"center",alignItems:"center"}}>{children}</div>;
        }
        else {
          return (
            <div style={{ display:"grid", gridTemplateColumns:  '18% 82%'  }}>
            
            <div style={{borderRight:'2px solid #e5e7eb',}}>
            {userAuth.role[0] === "ROLE_ADMIN" ? <AdminNavBar /> : userAuth.role[0] === "ROLE_CLIENT" ?
              
              <CustomerNavBar isArrow={isBack} />  :   userAuth.role[0] === "ROLE_COORDINATEUR" ? <CoordinatorNavbar />  : <></>
            
            }
            </div>

              <div id="maincontent" style={{ backgroundColor:"#f2edf3" ,  overflowY:"hidden"}}>
              <Header title={headerTitle} arrow={headerArrow}/> 
            <div style={{padding:'4px', paddingTop:'5%' }}>
            <headerTitleContext.Provider value={{setheaderTitle, setheaderArrow}}>
            <div style={{backgroundColor:'white',  border:'2px solid #e5e7eb',borderRadius:'5px',paddingTop:'2%', paddingBottom:'40px'  }}>{children}</div>
            
            </headerTitleContext.Provider>
            </div>
            
              </div>
            </div>
          );
        }

};

export default Layout;
