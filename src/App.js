import React,{useEffect,useState, createContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Accueil from "./pages/Coordinateur/Accueil";
import SuiviLot from './pages/client/SuiviLot';
import AddBox from './pages/client/addBox';
import Demandes from './pages/client/Lots';
import Boxrequest from './pages/client/box-request';
import Boxreturn from './pages/client/box-return';
import Boxes from './pages/client/Boxes';
import DemandeLookup from './pages/client/LotExpand.jsx';
import GestClient from './pages/Administrateur/GestionClients'
import Analytics from './pages/Administrateur/Analyticss'
import GestionDemandes from './pages/Coordinateur/GestionLots'
import {BrowserRouter,Routes,Route} from "react-router-dom";
// import Switch from "react-router-dom"
import BatchExpand from './pages/Coordinateur/LotExpandCoordinateur'
import LoginPage from './pages/authentication/loginPage'
import ProtectedRoute from './components/protectedRoute'
import GestionBoxes from './pages/Coordinateur/GestionBoxes'
import axios from "axios"
import CoordinatorBoxRequest from "./pages/Coordinateur/Process/BoxRequest"
import CoordinatorBoxReturn from "./pages/Coordinateur/Process/BoxReturn"
import CoordinatorAddBox from "./pages/Coordinateur/Process/AddBox"
import UserDetails from "./components/UserDetails"
import AdminDetails from "./pages/Administrateur/AdminDetails"
// import "../src/app.css"
import UserLogs from "./pages/Administrateur/UsersLogs"
import Contact from "./pages/client/Contact"
import AccueilClient from "./pages/client/Accueil"
import PasswordChanged from "./pages/client/PasswordChanged"
import AccountConfirmed from "./pages/client/AccountConfirmed"
import GestionSocietes from './pages/Administrateur/GestionSocietes';
import CoordinateurDetails from './pages/Coordinateur/ProfileDetails'
import Layout from './Layout/layout'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './pages/ErrorPages/NotFound';
export const UserContext = createContext();

function App() {


 const [bool,setBool]= useState(false)
 const [isAuth, setIsAuth] = useState(false)
 const [lot, setLotId] = useState(0)
 const [demande, setDemandeId] = useState(0)
 const [userId, setUserId]= useState(0)
 const [styleMode,setStyleMode] = useState('light')
  const [userAuth, setUserAuth] = useState({

      ID:"",
      company: "",
      email: "",
      role: [],
      token: ""
  });
  
 

  //verifier si un Httpcookie existe
  function checkCookieExistence(cookieName) {
   // Split the cookies into an array
   var cookies = document.cookie.split('; ');
 
   // Iterate over the cookies
   for (var i = 0; i < cookies.length; i++) {
     var cookie = cookies[i];
 
     // Check if the cookie starts with the given name
     if (cookie.indexOf(cookieName + '=') === 0) {
       return true; // Cookie found
     }
   }
 
   return false; // Cookie not found
 }
 /* function doesHttpOnlyCookieExist(cookiename) {
   var d = new Date();
   d.setTime(d.getTime() + (1000));
   var expires = "expires=" + d.toUTCString();
 
   document.cookie = cookiename + "=new_value;path=/;" + expires;
   return document.cookie.indexOf(cookiename + '=') == -1;
 }*/

 function getCookieValue(cookieName) {
   var name = cookieName + '=';
   var cookies = document.cookie.split(';');
 
   // Iterate over the cookies
   for (var i = 0; i < cookies.length; i++) {
     var cookie = cookies[i].trim();
 
     // Check if the cookie starts with the given name
     if (cookie.indexOf(name) === 0) {
       return cookie.substring(name.length); // Extract the cookie value
     }
   }
 
   return null; // Cookie not found
 }

 function getCookieValue(cookieName) {
   var name = cookieName + '=';
   var cookies = document.cookie.split(';');
 
   // Iterate over the cookies
   for (var i = 0; i < cookies.length; i++) {
     var cookie = cookies[i].trim();
 
     // Check if the cookie starts with the given name
     if (cookie.indexOf(name) === 0) {
       return cookie.substring(name.length); // Extract the cookie value
     }
   }
 
   return null; // Cookie not found
 }

 // this only a push test

 /*si le cookie n'existe pas  renvoyer vers login, sinon recuperer a partir du token les infos user
 et les mettre en variable globales pour l'acces dans toute l'app (useContext)*/
const getAnswer = async () => {

   if(checkCookieExistence("token") === false) {
     
    
      setUserAuth({
       
         token: "response.data.token",
         role: ["DefaultRole","jho"],
         ID:"response.data.ID",
         company: "response.data.company",
         email: "response.data.emai",
      
     })
     
     return;
    
   }

 

   axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/populateData`,{ headers:{
      'Authorization': "Bearer" + getCookieValue("token")}
    })
   .then((response) => {
   
     setUserAuth({         
        token: response.data.token,
        role: response.data.roles,
        ID:response.data.ID,
        company: response.data.company,
        email: response.data.email,
    })

 }).catch((error) => {
   alert("Jeton d'accès invalide")
   document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload()
 })
 

};

  useEffect(() => {
   
   getAnswer();
   
 }, []);

 

if ( userAuth.role[0]  === undefined ) {
   
   return null
}

else{
   
   return (
 
      <UserContext.Provider value={{userAuth,setUserAuth,setIsAuth,styleMode,setStyleMode,setLotId,setUserId,setDemandeId}} >
      
        <BrowserRouter>
        <Layout>
         <Routes>
            
        
            <Route path="/"  element={<LoginPage/>}/>
            
            
            <Route path="Admin/companies" 
               element={
                  userAuth.role[0] === "ROLE_ADMIN" ? <ProtectedRoute>
                                          <GestionSocietes/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
               } />

               <Route path="Admin/clients" 
                  element={
                  userAuth.role[0] === "ROLE_ADMIN" ? <ProtectedRoute>
                                          <GestClient/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            

            <Route path="Admin/usersLogs" 
               element={
                  userAuth.role[0] === "ROLE_ADMIN" ? <ProtectedRoute>
                                          <UserLogs/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } 
                                       />
                
            <Route path="Admin/statistiques" 
               element={
                  userAuth.role[0] === "ROLE_ADMIN" ? <ProtectedRoute>
                                          <Analytics/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
    
            <Route path="Coordinateur/demandes" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                          <GestionDemandes/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />

            <Route path="Coordinateur/Accueil" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                          <Accueil/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="Coordinateur/Demandes/boxRequest" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                             <CoordinatorBoxRequest/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />   
            
            <Route path="Coordinateur/Demandes/boxReturn" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                          <CoordinatorBoxReturn/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />  

            <Route path="Coordinateur/Demandes/addBox" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                          <CoordinatorAddBox/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />  
            
           
            <Route path="Coordinateur/boxes" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                          <GestionBoxes/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />


            <Route path="Coordinateur/profileDetails" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                          <CoordinateurDetails/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />                            
                     
            <Route path="Admin/demandes/:company/:demandeid" 
               element={
                  userAuth.role[0] === "ROLE_COORDINATEUR" ? <ProtectedRoute>
                                          <BatchExpand/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="UserProfile" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT"  ? <ProtectedRoute>
                                          <UserDetails/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="PasswordChanged/:newpassword/:usrId" element={<PasswordChanged/>} />
            
            <Route path="AccountConfirmed/:usrId" element={<AccountConfirmed/>} />  
            
            <Route path="Contact" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT"  ? <ProtectedRoute>
                                          <Contact/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="Admin/ProfileDetails" 
               element={
                  userAuth.role[0] === "ROLE_ADMIN"  ? <ProtectedRoute>
                                          <AdminDetails/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            
            <Route path="Client/Demandes/:userID/:company" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                          <Demandes/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            
            <Route path="Client/Boxes/:userID/:company" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                          <Boxes/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="Client/Accueil/:userID/:company" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                          <AccueilClient/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="Client/Demandes/:userID/:company/addBox" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                          <AddBox/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="Client/Lot/:company/:lotID/suivitlot" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                          <SuiviLot/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />
            
            <Route path="Client/Demandes/:userID/:company/boxRequest" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                             <Boxrequest/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />   
            
            
            <Route path="Client/Demandes/:userID/:company/boxReturn" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                          <Boxreturn/>
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } />  
            
            
            <Route path="Client/Demandes/demandesLookup/:lotID/:company" 
               element={
                  userAuth.role[0] === "ROLE_CLIENT" ? <ProtectedRoute>
                                          <DemandeLookup />
                                          </ProtectedRoute> :
                                          <LoginPage/>
                                       } /> 
            
            <Route path="*" element={<NotFound/>} />
       
    
         </Routes>
        </Layout>
         </BrowserRouter>
    
      </UserContext.Provider>
     
      
      );

}

}

export default App;
