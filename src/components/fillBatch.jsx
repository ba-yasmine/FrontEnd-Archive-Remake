import Form from 'react-bootstrap/Form';
import React,{useEffect,useState,useContext}from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {AiFillEdit} from "react-icons/ai"
import {BsCheckCircle}  from "react-icons/bs"
import axios from 'axios'
import {UserContext} from "../App"
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import FormBox from "./boxForm"
import {MdOutlineWarehouse} from "react-icons/md"
import RedirectToWareHouse from "./RedirectToWareHouseModal"


function FillBatch({batch}) {
  const [show, setShow] = useState(false);
  const [remainigBoxes, setRemaningBoxes] = useState();
  const {userAuth,setUserAuth} = useContext(UserContext);
  const [boxesList, setBoxlist] = useState(batch.boxes);
  const [departementList,setDepartementList] = useState([])
  const [refresh, setRefresh] = useState(0);
  let rem =boxesList?.filter((el)=>{ return el.description === null || el.departement === null}).length

 const handleRefresh = (state) =>{
    setRefresh(state)
 }

 useEffect(() => {
 if (show) {
    axios.get(`${process.env.REACT_APP_HOST_VAR}rest/departements/getDepartements/${batch.createur.company.id}`,{headers:{
        'Authorization':  "Bearer" + userAuth.token
      }}).then((response) =>{
        setDepartementList(response.data)
      })


 axios.get(`${process.env.REACT_APP_HOST_VAR}rest/batches/getBatches/${batch.createur.company.id}/${batch.id}`,{ headers:{
        'Authorization':  "Bearer" + userAuth.token
      }})
      .then((response) =>{
       
        setBoxlist(response.data.boxes);
             
           }
          )

 }

    
 }, [show, refresh])
 


  return (
    <>
      <Button style={{backgroundColor:'white', border:'none'}} onClick={() => setShow(true)}>
        <AiFillEdit style={{color:'#0243cd', fontSize:'30px',}}/>
      </Button>

      <Modal
        show={show}
        size="xl"
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="FillBtach-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title 
          style={{color:"#0243cd", display:'flex', justifyContent: 'space-between', alignItems:'center', width:'90%'}}
          id="FillBtach-custom-modal-styling-title">
            <div>Compléter le lot {batch.id}</div>
           <div> <h5 style={{color:"#0243cd" }} > <BsCheckCircle style={{color:'#0243cd', fontSize:'26px',marginRight:'10px'}}/>{Number(batch.nbrBoites) - rem} / {batch.nbrBoites}</h5></div>
           
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
            
        <div style={{width:'100%', display:'grid', gridTemplateColumns: "repeat( auto-fit, minmax(400px, 2fr) )",gridGap:'20px', padding:"20px",margin:'auto'}}>
          {boxesList  && boxesList.map((el,id) =>{
        
        if (el.description === null || el.departement === null){
            return  <FormBox departementList={departementList} el={el} key={id} onRefresh={handleRefresh} />
           }
          
          }) }
          
         {Number(batch.nbrBoites) - rem === batch.nbrBoites ? 
            <Button style={{backgroundColor:"#ffffff", border:'2px solid #e5e7eb', color:'#0243cd', width:'30%', margin:'auto', display:'flex', justifyContent: 'center'}}><h5 style={{color:"#0243cd", textAlign:"center",fontWight:'600', marginTop:'5px'}}> <RedirectToWareHouse batchId={batch} />  rediriger vers l'entrepot </h5> </Button> :<>yuyyrt</>
          }
          
          
       </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FillBatch;