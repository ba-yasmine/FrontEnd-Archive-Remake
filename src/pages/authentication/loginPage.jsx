import React,{useEffect,useState,useContext} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Resetp from '../../components/passwordForgot'
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../../App"
import "../Administrateur/style.css"
import InputGroup from 'react-bootstrap/InputGroup';
import { RiLockPasswordLine} from "react-icons/ri";
import { BiLogInCircle} from "react-icons/bi";
import './Loginstyle.css';


const LoginPage = () => {

  const [width, setWidth] = useState(window.innerWidth);
    const {userAuth,setUserAuth,setIsAuth} = useContext(UserContext);
    const [mail,setmail] = useState("")
    const [password,setpassword] = useState("")
    const [msg,setmsg] = useState(false);
    const [msg1,setmsg1] = useState(false);
    const [res,setRes] = useState({message:"",status:""});

    let obj={email:mail, password: password}
    let navigate = useNavigate();

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
  
      // Clean up the event listener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
  
    function setCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    }
    
    // Example usage
   
    
   
   const emailRegex = new RegExp("^.+@[^\.].*\.[a-z]{2,}$");
   const PasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$");

   

   /*verification des input par Regex , puis envoie combo email,password et fetch
      des données du user puis rediriger selon le role*/
    const login=(e) =>{

      e.preventDefault()

     if(!emailRegex.test(mail)){setmsg(true); return} else {setmsg(false);}
      if(PasswordRegex.test(password)){setmsg1(true); return} else {setmsg1(false);}
        axios.post(`${process.env.REACT_APP_HOST_VAR}rest/user/login`,obj,{ withCredentials: true })
        .then((response) =>{
         
         
          if(response.data.token === undefined )
          {
           
            setRes({message:response.data.message, status:response.status})
            
          } 
          else {
            setCookie("token", response.data.token, 1);
            //console.log(response.data.firstname+" , "+response.data.lastname)
            setUserAuth({
              
              token: response.data.token,
              role: response.data.roles,
              ID:response.data.ID,
              company: response.data.company,
              email: response.data.email,
              
            })
            
            
            if (response.data.roles[0] === "ROLE_CLIENT"){   navigate(`/Client/Accueil/${userAuth.ID}/${userAuth.company}`);setIsAuth(true);}
            
        else if (response.data.roles[0] === "ROLE_COORDINATEUR") { navigate('/Coordinateur/Accueil');setIsAuth(true);} 
             else if (response.data.roles[0] === "ROLE_ADMIN") { navigate('/Admin/clients');setIsAuth(true);}
          }
             }
            ).catch((e)=>{
            
              setRes({message:e.response.data, status:e.response.status})
            });
  
    }




        
  return (
    <div style={{height:"100vh",width:"100%", backgroundRepeat:"repeat",backgroundSize:"cover", overflowY:"hidden", display:'flex', justifyContent:"center",alignItems:'center', backgroundColor:"rgb(244, 244, 254)"}}>
      <div id="loginBack" style={{boxShadow:"3px 3px 10px rgb(0,0,48)", width:"auto", padding:"20px", background: "linear-gradient(90deg, #f1c93a, #0243de )",backgroundSize:"cover", transition: "transform 0.5s ease-out",}}>
      <div style={{ width: "95%", display: "flex", flexDirection: "column", alignItems: "center", padding: "7px", backgroundColor: "white", borderRadius: "10px", margin: "auto" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" , padding:"8px 15px" }}>
        <img id="archivy" style={{ width: width <= 750 ? "25vw" : "10vw" }} src="https://i.postimg.cc/qq0T7nbP/logoarch.png" alt="" height="auto" />
        <img id="capturedoc" style={{ width: width <= 750 ? "25vw" : "10vw" }} src="https://i.postimg.cc/q7kbpC3j/cdlogo.png" alt="" height="auto" />
      </div>
    </div>
        <div id='loginlayout' style={{ width:"100%", display: "flex", justifyContent:"center", alignItems: "center",  padding:"20px",  borderRadius:"10px"}}>
      <div  style={{display: 'flex', flexDirection: 'column', color:"#0243cd", width:"50%",flexGrow:"0",flexShrink:"0"}} id="form">

<Form id="formlog" style={{backgroundColor:"white",margin:"auto",width:"100%",height:"480px" , padding:"25px", borderTopLeftRadius:"10px" , borderBottomLeftRadius:"10px" ,border:"2px solid #e5e7eb",marginRight:"18px", flexGrow:"1", }} onSubmit={login}>
<h4 style={{textAlign:"center",marginBottom:"35px"}}>Connexion</h4>
{res.message !== "" ? <Alert style={{textAlign:"center",fontSize:"15px", fontWeight:"600", height:"20px",display:"flex", justifyContent:"center",alignItems:"center"}} variant="danger">
      {res.message}
    </Alert> : <></>}

<Form.Label style={{fontWeight:'600'}}>E-mail:</Form.Label>
     <InputGroup className="mb-3">
    
        <InputGroup.Text id="basic-addon1" style={{backgroundColor:'white'}}>@</InputGroup.Text>
        
        <Form.Control style={{height:"50px", borderRadius:"8px", borderTopLeftRadius:"0px" , borderBottomLeftRadius:"0px", fontWeight:'300', fontSize:'16px'}}required onChange={e=>setmail(e.target.value)} type="email" placeholder="example@mail.com" maxlength="50" minlength="10" />
        <br />
        {msg === true ? <p style={{color:"red"}} >le format de l'email est invalide</p> : <p></p>}
        </InputGroup>

<br />
        <Form.Label style={{fontWeight:'600'}}>Mot de passe:</Form.Label>
        <InputGroup className="mb-3">
        
    <InputGroup.Text id="basic-addon1" style={{backgroundColor:'white'}}><RiLockPasswordLine /></InputGroup.Text>
       
        <Form.Control style={{height:"50px",borderRadius:"8px", borderTopLeftRadius:"0px" , borderBottomLeftRadius:"0px",fontWeight:'300', fontSize:'16px'}}  required onChange={e=>setpassword(e.target.value)} type="password" placeholder="**********"  maxlength="20" />
        <br />
        {msg1 === true ? <p style={{color:"red"}}>le mot de passe doit avoir minimum 8 caractères, une majuscule et un chiffre</p> : <p></p>}
        </InputGroup>
          
     <br />
      <div style={{display: 'flex' , justifyContent: 'space-between' ,alignItems: 'center'}} id="connect">
      <div id="connecter">
      <Button variant="primary" type="submit">
         Se connecter
      </Button>
      </div>
      
      <Resetp email={mail}/>
      </div>
      
   
      
     
    </Form>

    </div>
    

    <Card style={{maxWidth:"50%", height:"480px", border:"0px", flexGrow:"0", flexShrink:"1", borderRadius:"10px",borderTopLeftRadius:"0px",borderBottomLeftRadius:"0px" }}  id="cardImg">
      <Card.Img style={{height:"100%", border:"2px solid #e5e7eb" , borderLeft:'0px'}} src='https://i.postimg.cc/MZ4qvk6R/logincover.jpg'  alt=".kvk" />
      <Card.ImgOverlay >
        <Card.Title></Card.Title>
        <Card.Text>
          
        </Card.Text>
        <Card.Text></Card.Text>
      </Card.ImgOverlay>
    </Card>
    </div></div>
      
    </div>
    
  
     
  )
}

export default LoginPage