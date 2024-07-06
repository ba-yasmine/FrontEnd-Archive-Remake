import React,{useEffect,useState,useContext} from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import ListGroup from 'react-bootstrap/ListGroup';
import "../Administrateur/style.css"
import {headerTitleContext} from '../../Layout/layout'
import {UserContext} from "../../App"
import '../../components/styleButton.css';

const UserDetails = () => {

  const {setheaderTitle, setheaderArrow} = useContext(headerTitleContext);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [object, setObject] = useState()
  const [corps, setCorps] = useState()
  useEffect(() => {
    setheaderTitle('Assistance et contact')
    setheaderArrow(false)
  })

  const sendRequest = async (e) =>{
    e.preventDefault()
    try{
      const response = await axios.get(`${process.env.REACT_APP_HOST_VAR}rest/batches/sendAssistanceMail/${userAuth.ID}`, {
        params: {
        "objet":object,
        "corps":corps
        },
        headers:{'Authorization':  "Bearer" + userAuth.token}
      });
      toast.success(response.data.message)
    }
    catch(e) {
      toast.error(e.response.data.message)
    }

    

  }
   
  
    return (
      <div >
           
            
          <main id="contact" style={{display:"flex",flexDirection:'column', alignItems:"center", justifyContent:"center"}}>
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            />
         
            <ListGroup  id="lists" style={{width:"50%",margin:"50px" }} as="ol" >
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" , paddingBottom:'20px', paddingTop:'10px'}}
        as="li"
       
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div style={{fontWeight:'600', fontSize:'16px'}} >Adresse</div>
          <div style={{ fontSize:'14px'}} >187 lot bouchaoui 2, N°32, Chéraga 16084</div>

        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" ,paddingBottom:'20px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div style={{fontWeight:'600', fontSize:'16px'}} >Téléphone  </div>
           <div style={{ fontSize:'14px'}} >0560 98 57 75</div>

        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)",paddingBottom:'20px', paddingTop:'10px'}}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div style={{fontWeight:'600', fontSize:'16px'}} >Email</div>
          <div style={{ fontSize:'14px'}} >info@capturedoc.com</div>

        </div>
       
      </ListGroup.Item>
      <ListGroup.Item
      style={{color:"rgb(41,41,41)" ,paddingBottom:'20px', paddingTop:'10px' }}
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 " style={{marginRight:"10px"}}>
          <div style={{fontWeight:'600', fontSize:'16px', marginBottom:"15px"}}>Envoyer un message</div>
         <form onSubmit={(e) =>sendRequest(e)}>
          <FloatingLabel controlId="floatingSelect" label="Veuillez sélectionner le motif de votre requête:">
      <Form.Select required onChange={e => setObject(e.target.value)} aria-label="Veuillez sélectionner le motif de votre requête:">
        <option>Veuillez sélectionner le motif de votre demande:</option>
        <option value="Consultation ds logs d'activité de ma société">Consultation ds logs d'activité de ma société</option>
        <option value="Destruction de boites d'archives">Destruction de boites d'archives</option>
        <option value="Autres reseignement">Autres reseignement</option>
      </Form.Select>
    </FloatingLabel>
    <br /> 
      <FloatingLabel  controlId="floatingTextarea2" label="Saisir votre message">
     
        <Form.Control
          onChange={e => setCorps(e.target.value)}
          required
          minLength={3}
          as="textarea"
          style={{width:"100%", marginRight:'0px'}}
          
        />
      </FloatingLabel>
      <div className="buttonStyle">
          <Button type="submit" style={{marginTop:"30px",marginBottom:"10px"}}>Envoyer votre demande</Button>
      </div>
      </form>
        </div>
       
      </ListGroup.Item>
      
    </ListGroup>
          </main>

     
      
            

     
    

      
        </div>
           
       
  )
}

export default UserDetails