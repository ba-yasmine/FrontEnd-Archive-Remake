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
    const [entrepotList,setentrepotList]= useState([])
    const [resultMap,setResultMap]= useState([])

    const data = {
        labels:  resultMap? resultMap.map(el => el[0]) : ''  ,
        datasets: [
          {
            label: '',
            data: resultMap? resultMap.map(el => el[1]) : '' ,
            backgroundColor: 'rgba(239, 194, 35, 0.2)',
            borderColor: 'rgba(239, 194, 35, 1.0)',
            borderWidth: 1,
          },
        ],
      };

      useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/entrepot/getAllEntrepot`, {
            headers: {
                'Authorization': "Bearer " + userAuth.token
            }
        })
        .then((response) => {
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setentrepotList(response.data);
                axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByCompanyInWarehouse/${response.data[0].id}`, {
                    headers: {
                        'Authorization': "Bearer " + userAuth.token
                    }
                })
                .then((response) => {
                    setResultMap(response.data);
                });
            } else {
                console.error("No data received for entrepot list.");
                // Handle the case where the data is empty or not an array
            }
        })
        .catch((error) => {
            console.error("Error fetching entrepot list:", error);
            // Handle error appropriately
        });
    }, []);
    

    const handleCompanyChange =(e)=>{
        let id =e.target.value
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByCompanyInWarehouse/${id}`,{ headers:{
            'Authorization': "Bearer" + userAuth.token
          }})
          .then((response) =>{
            if(response.data){
            setResultMap(response.data)}})
    
    }


    return (
        <div style={{display:"flex", flexDirection: "column"}}>
        <div>
        <p style={{fontWeight:'600'}}>Boites groupées par entrepôt </p>
        <FloatingLabel controlId="floatingSelect" label="Works with selects">
        <Form.Select  aria-label="Default select example" onChange={(e)=> handleCompanyChange(e)}>

      {entrepotList?.map(el => (
        <option value={el.id}>{el.name}</option>
      ))}
     
    </Form.Select>
    </FloatingLabel>
        </div>
        <div style={{ width: "100%", height: 280 }}>
    <Bar data={data} options={options} />
  </div>
 
    </div>
 
    )
}
   


export default VerticalBarChart;
