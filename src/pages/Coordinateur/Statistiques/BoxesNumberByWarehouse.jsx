import React, {useState,useEffect,useContext} from 'react';
import { Bar } from 'react-chartjs-2';
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
            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByWarehouse`,{ headers:{
                'Authorization': "Bearer" + userAuth.token
              }})
              .then((response) =>{
                setResultMap(response.data)})
        
        
        }})
    
     
    },[])



    return (
        <div style={{display:"flex", flexDirection: "column"}}>
        <div>
        <p style={{fontWeight:'600'}}>Nombre de boites par entrepôt </p>
      <br />
      <br />
      
        </div>
        <div style={{ width: "100%", height: 280 }}>
    <Bar data={data} options={options} />
  </div>
 
    </div>
 
    )
}
   


export default VerticalBarChart;
