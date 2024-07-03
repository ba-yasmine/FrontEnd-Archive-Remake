import React, {useState,useEffect,useContext} from 'react';
import { Pie } from 'react-chartjs-2';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from "axios"
import {UserContext} from "../../../App"



const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

const VerticalBarChart = () => {

    const {userAuth,setUserAuth} = useContext(UserContext);
    const [companiesList,setCompaniesList]= useState([])
    const [selectedCompanie,setSelectedCompanie]= useState([])
    const [resultMap,setResultMap]= useState([])

    const data = {
        labels:  resultMap? resultMap.map(el => el[0]) : ''  ,
        datasets: [
          {
            label: '',
            data: resultMap? resultMap.map(el => el[1]) : '' ,
            backgroundColor: 'rgba(2, 67, 205, 0.2)',
            borderColor: 'rgba(2, 67, 205, 1.0)',
            borderWidth: 1,
          },
        ],
      };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/company/getAllCompanies`,{ headers:{
            'Authorization': "Bearer" + userAuth.token
          }})
          .then((response) =>{
            if(response.data){
            setCompaniesList(response.data);
            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByDepartementInCompany/${response.data[0].id}`,{ headers:{
                'Authorization': "Bearer" + userAuth.token
              }})
              .then((response) =>{
                setResultMap(response.data)})
        
        
        }})
    
     
    },[])

    const handleCompanyChange =(e)=>{
        let id =e.target.value
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByDepartementInCompany/${id}`,{ headers:{
            'Authorization': "Bearer" + userAuth.token
          }})
          .then((response) =>{
            if(response.data){
            setResultMap(response.data)}})
    
    }


    return (
        <div style={{display:"flex", flexDirection: "column"}}>
        <div>
        <p style={{fontWeight:'600'}}>Boites groupées par départements</p>
        <FloatingLabel controlId="floatingSelect" label="Works with selects">
        <Form.Select  aria-label="Default select example" onChange={(e)=> handleCompanyChange(e)}>

      {companiesList?.map(el => (
        <option value={el.id}>{el.nomSociete}</option>
      ))}
     
    </Form.Select>
    </FloatingLabel>
        </div>
        <div style={{ width: "100%", height: 280 }}>
    <Pie data={data} options={options} />
  </div>
 
    </div>
 
    )
}
   


export default VerticalBarChart;
