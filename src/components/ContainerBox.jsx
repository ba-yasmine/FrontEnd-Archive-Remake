import Form from 'react-bootstrap/Form';
import React,{useEffect,useState,useContext}from 'react'
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import {UserContext} from "../App"
import Dropdown from 'react-bootstrap/Dropdown';
import "../pages/Administrateur/style.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdAddCircle} from "react-icons/io";
const ContainerBox = ({Donnes, provenance, company,datePickup}) => {

  const [btn,setbtn] = useState("modifier")
  const [desc,setdesc] = useState("")
  const [ListDonne,setListDonne] = useState(Donnes)
  const [msg,setmsg] = useState({
    status:"",
    message:""
  })
  const [acceptAdd,setAccept] = useState(false);
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [departementList,setDepartementList] = useState([])
  const [departement,setDepartement] = useState()
  const [refresh,setRefresh] = useState(false)
  const [isLoading, setLoading] = useState(false);
  let dateParam = "";
  let companys;


useEffect(() => {

if(refresh === true){
  
  setTimeout(() => {
    document.location.reload();
  }, 2500);
}
else{
  return;
}


},[refresh])




  useEffect(() => {
    if (company === undefined){
     
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/user/getDepartements/${userAuth.ID}`,{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{setDepartementList(response.data);setDepartement(response.data[0]); })
    }
   else{
    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getDepartements/${company}`,{ headers:{
      'Authorization':  "Bearer" + userAuth.token
    }})
    .then((response) =>{setDepartementList(response.data); setDepartement(response.data[0]); })
  
   }
  },[])

 //envoie le tableau d'object de boxes
 const sendTo=()=>{
  setLoading(true)
  ListDonne.map((el)=> {
    if(el.state === 'new') {
      DeleteFromState(el);
    }
  })

  for(let i=0; i<ListDonne.length; i++) {
        
      delete ListDonne[i].id; delete ListDonne[i].state 

  }
  
  
 
 if (datePickup === undefined){
  dateParam = null;
 }
 else{
  dateParam = datePickup.toISOString();
 }

 if( company === undefined){
    companys = userAuth.company;
 }
 else{
  companys = company
 }


  axios.post(`${process.env.REACT_APP_HOST_VAR}rest/batches/createBatch/Add_Box/${companys}/${userAuth.ID}/${provenance}/${dateParam}`,ListDonne,{ headers:{
    'Authorization':  "Bearer" + userAuth.token
  }})
    .then((response) =>{
    
      toast.success(response.data.message)

      setTimeout(() => {
       window.location.reload()
      }, 3000);

         }
        ).catch(e =>{
          toast.success(e.data.message)

        })
   
   
        
  }
 
  //supprime la derniere box du tableau d'object de boxes
  const DeleteFromState = (idx) => {

   
    const newState = ListDonne.filter(el=> {return el !== idx} )

    setListDonne(newState);
    
    
  };
 

//ajoute une box au tableau d'object de boxes
  const addToList= (idx)=>{
    let temp=[...ListDonne];

   

    if(desc === ""  ){

     
        return;
      
      
    }
     
    else {
      
     
    
      temp.map((el) => {
       if(el === idx) {
        
         el.state="succes"
         if (desc !== ""){ el.description=desc;}
       
         el.company.id=userAuth.company;
         el.departements={id:departement.id, nom: departement.nom}
         
       }
     });
    
     
   
     setListDonne(temp)
     setdesc("");
  
   
   

    }
   
      
 
  

  }
   

  const AlterList= (idx)=>{
    
    let temp=[...ListDonne];

    if( desc === "" ){

    temp.map((el) => {

       if(el.id === idx) {
        
         el.state="new"
         el.description="";
         el.departements={id:departement.id}
         
       }
     });

    
      setListDonne(temp)
      setdesc(""); 
  
      
      
    
    }

    else { 
         
     
      
    
      temp.map((el) => {
       if(el.id === idx) {
        
         el.state="succes"
         if (desc !== ""){ el.description=desc;}
        el.departements={id:departement.id}
         
       }
     });

     setListDonne(temp)
     setdesc("");
     
    }
   
   
   
   
  
      
 
  

  }

 
    const dt=ListDonne.map((el,idx) => {
     
      if(el.state === "new"){

        return (
         
          <Form  style={{border:"2px solid #0243cd",padding:"20px",borderRadius:"5px",color:"#0243cd",width:"100%",margin:"30px"}} key={idx}>
          <h3>Boite N°{idx+1}</h3>
          <Form.Group required className="mb-3" >
          <Form.Label>Description</Form.Label>
          <textarea  maxlength="100"  class="form-control" onChange={e=> setdesc(e.target.value)} type="text" required placeholder="Saisir une description" defaultValue={ListDonne[idx]?.description} ></textarea>
          </Form.Group>
           







          
          
          <Form.Group  className="mb-3" controlId="formBasicEmail">
        <Form.Label>Département</Form.Label>
        <Dropdown style={{border: '1px solid #ced4da', borderRadius:"5px", }} required>
        <Dropdown.Toggle placeholder="Enter description"required style={{outline: 'none',}} variant="Primary" id="dropdown-basic">
       {departement?.nom}
      </Dropdown.Toggle>

      <Dropdown.Menu>
      
       {departementList !== null ? departementList.map((el,id)=>{

         return(
          <Dropdown.Item id={id} onClick={()=> setDepartement({id:el.id, nom:el.nom})} >{el.nom}</Dropdown.Item>)
       }) :
           
       <p>Aucun département disponible</p>
       
      }
    
        
        
       
      </Dropdown.Menu>
    </Dropdown>
      </Form.Group>
          {el.state === "new" || el.state === "modif" ? <Button type="submit" style={{backgroundColor:"#0243cd"}} onClick={()=>addToList(el)} variant="primary">
             Confirmer
           </Button> : el.state === "succes"  ? <div> <Button style={{backgroundColor:"#0243cd", color:"#fff"}} onClick={(e)=>{AlterList(el.id); e.target.style.backgroundColor="green"; setbtn("modifier"); } }   variant="light">
             {btn}
           </Button> {idx !== 0  && idx === ListDonne.length - 1 ? <Button style={{ color:"#fff"}} onClick={()=>{ DeleteFromState(el)} }   variant="danger"> 
             Supprimer
           </Button> : <p></p> } </div> 
           : <div style={{display:"flex", flexDirection:"row", gap:"10px"}}><Button type="submit" style={{backgroundColor:"#0243cd", height:"42px"}} onClick={()=>{ if( desc !== "")  {addToList(el.id)} else{ return }}} variant="primary">
           Confirmer
         </Button> <p style={{color:"red", marginLeft:"9px", marginTop:"10px"}}> </p></div>
           
          
        }
          
           
          </Form>


        )
      }
       else if(el.state === "succes" ) {

        return (
        
          <Form  style={{border:"2px solid #e5e7eb",padding:"20px",borderRadius:"5px",color:"#0243cd",width:"100%",margin:"30px"}} key={idx}>
          <h4>Boite N°{idx+1}</h4>
          <br />
          <div style={{width:"100%", borderRadius:"5px" , border: "1px solid #0243cd", padding: "08px", marginBottom:"10px"}}><h5>Description :  </h5><p style={{marginLeft:"5px", fontSize:"16px", fontWeight:"600"}}>{el.description}</p></div>
        
          <h6>Département:    {el.departements.nom}</h6>
          <br />
          {el.state === "new" || el.state === "modif" ? <Button type="submit" style={{backgroundColor:"#0243cd"}} onClick={()=>addToList(el)} variant="primary">
             Confirmer
           </Button> : el.state === "succes"  ? <div> <Button style={{backgroundColor:"#0243cd", color:"#fff"}} onClick={(e)=>{AlterList(el.id); e.target.style.backgroundColor="green"; setbtn("modifier"); } }   variant="light">
             {btn}
           </Button> {idx !== 0  && idx === ListDonne.length - 1 ? <Button style={{ color:"#fff"}} onClick={()=>{ DeleteFromState(el)} }   variant="danger"> 
             Supprimer
           </Button> : <p></p> } </div> 
           : <div style={{display:"flex", flexDirection:"row", gap:"10px"}}><Button type="submit" style={{backgroundColor:"#0243cd", height:"42px"}} onClick={()=>{ if( desc !== "")  {addToList(el.id)} else{ return }}} variant="primary">
           Confirmer
         </Button> <p style={{color:"red", marginLeft:"9px", marginTop:"10px"}}> </p></div>
           
          
        }
          </Form>
        
        )
        }

      
        
          
          
        } 
    ) 
    function handleClick(){
      if(ListDonne[0].titre !== "" || ListDonne[0].description !== "")
      {
        sendTo();
      }
    }
      
if ( provenance === "choisir une option"){
  return <div  style={{margin:"auto", color:"#0243cd", border:'2px solid #e5e7eb', borderRadius:'5px' , padding:'20px', width:'100%'}}>
    <p style={{fontWeight:"600"}}>Veuillez d'abord choisir une provenance</p>
  </div>
}
        
    return(
        <div  style={{margin:"auto", color:"#0243cd", border:'2px solid #e5e7eb', borderRadius:'5px' , padding:'20px', width:'100%'}}>
 <div style={{ display:"flex",flexDirection:"column", marginTop:"10px" }}>
          {ListDonne[0].description === "" ? <p style={{margin:"auto",marginBottom:"10px", fontSize:"20px", fontWeight:"500"}}  variant="primary">
             Au moins une boite doit être renseignée
           </p>
           :  ( ListDonne[0].description !== "" ) && msg.message === "" ? <Button
           disabled={isLoading}
           onClick={!isLoading ? handleClick : null}
           style={{width:"250px" ,height:"45px",marginTop:"3px",margin:"auto" ,backgroundColor:"#0243cd", marginBottom:"10px"}}  variant="primary">
             Envoyer la demande
           </Button> : <></> }
          
        
         </div>
         <hr />
{( ListDonne[ListDonne.length-1].description === "")  && acceptAdd === true  ? <div style={{display:"flex", flexDirection:"row", gap:"10px"}}><Button style={{background:"none",border:"none",  marginBottom:"20px",marginLeft:"30px",marginTop:"10px"}} onClick={()=>{if(ListDonne[ListDonne.length-1].titre !== "" && ListDonne[ListDonne.length-1].description !== "") {   setListDonne([...ListDonne,{id:ListDonne.length ,state:"new",  description:"",company:{id:userAuth.company}, departement:""}], ); }else {return;}}} variant="primary">
<IoMdAddCircle  style={{fontSize:"50px",color:"#0243cd"}}/>
         </Button> <p style={{color:"red", marginLeft:"9px", marginTop:"10px", fontWeight:"600", fontSize:"18px"}}>Veuillez d'abord reseigner les données de la boite en cours </p></div>:   <Button id="btnadd" style={{background:"none",border:"none",marginBottom:"20px",marginLeft:"30px", marginTop:"10px"}} onClick={()=>{setAccept(true) ;if( ListDonne[ListDonne.length-1].description !== "") {setListDonne([...ListDonne,{id:ListDonne.length ,state:"new",  description:"",company:{id:userAuth.company}, departement:""}]); setAccept(false)} else { return }}} variant="primary">
       <IoMdAddCircle  style={{fontSize:"50px",color:"#0243cd"}}/>
         </Button>  }
          <div id="boxgrid" style={{display:"grid", gridTemplateColumns:"2fr 2fr 2fr ", gridGap:"50px"}}>
          {dt.reverse()}
          </div>
        
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            color="green"
            
            />
      
        
        

         </div>
    )


        

}

export default ContainerBox

        
