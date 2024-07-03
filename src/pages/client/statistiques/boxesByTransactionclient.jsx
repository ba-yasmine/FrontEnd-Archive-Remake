import React, {useState,useEffect,useContext} from 'react';
import { Bar } from 'react-chartjs-2';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from "axios"
import {UserContext} from "../../../App"
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import {AiOutlineCheckSquare} from "react-icons/ai"
const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

const schema = yup.object().shape({
    date: yup.string().required('mois obligatoire'),
  });

const VerticalBarChart = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      });

    const {userAuth,setUserAuth} = useContext(UserContext);
    const [entrepotList,setentrepotList]= useState([])
    const [formChanged, setFormChanged] = useState(false);
    const [resultMap,setResultMap]= useState([])

    const data = {
        labels:  resultMap? resultMap.map(el => el[0]) : ''  ,
        datasets: [
          {
            label:'',
            data: resultMap? resultMap.map(el => el[1]) : '' ,
            backgroundColor: 'rgba(2, 67, 205, 0.2)',
            borderColor: 'rgba(2, 67, 205, 1.0)',
            borderWidth: 1,
          },
        ],
      };

      const onSubmit = (data) => {
      
         let currentMonth
        if(data.date === null) {
            const today = new Date();
             currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
        }
        else {
            currentMonth = data.date.slice(5)
        }
        
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByDateCustomer/${currentMonth}/${userAuth.company}`,{ headers:{
            'Authorization': "Bearer" + userAuth.token
          }})
          .then((response) =>{
            setResultMap(response.data)})
      
    }


  

    useEffect(() => {
       
            const today = new Date();
            const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByDateCustomer/${currentMonth}/${userAuth.company}`,{ headers:{
                'Authorization': "Bearer" + userAuth.token
              }})
              .then((response) =>{
                setResultMap(response.data)})
          
    
     
    },[])


    return (
        <div style={{display:"flex", flexDirection: "column"}}>
        <div>
        <p style={{fontWeight:'600'}}>Transactions de la société</p>
        <div >
        <Form style={{display:'flex', flexDirection:'row', justifyContent: 'space-between',gap:'30px'}} onSubmit={handleSubmit(onSubmit)} >
        <div style={{display:'flex', flexDirection:'row', gap:"10px", width:"80%"}}>
        <FloatingLabel controlId="date" label="Date">
    <Form.Control type="month"   {...register('date') }  />
    {errors.date && <span>{errors.date.message}</span>}
  </FloatingLabel>
  
        
    
    </div>  
    
   
   <Button style={{backgroundColor:'white', border:'none'}}  type="submit"><AiOutlineCheckSquare style={{color: "#0243cd", fontSize:'30px'}}/></Button>
   
  
</Form>
        </div>
        
        </div>
        <div style={{ width: "100%", height: 280 }}>
    <Bar data={data} options={options} />
  </div>
 
    </div>
 
    )
}
   


export default VerticalBarChart;
