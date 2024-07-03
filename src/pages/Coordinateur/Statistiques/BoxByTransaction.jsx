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
    entrepot: yup.string().required('entrepot obligatoire '),
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
        
        axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByDate/${currentMonth}/${data.entrepot}`,{ headers:{
            'Authorization': "Bearer" + userAuth.token
          }})
          .then((response) =>{
         
            setResultMap(response.data)}
          
          )
      
    }


  

    useEffect(() => {
      axios.get(`${process.env.REACT_APP_HOST_VAR}rest/entrepot/getAllEntrepot`, {
          headers: {
              'Authorization': "Bearer " + userAuth.token
          }
      })
      .then((response) => {
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
              setentrepotList(response.data);
              const today = new Date();
              const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
              axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesCountByDate/${currentMonth}/${response.data[0].id}`, {
                  headers: {
                      'Authorization': "Bearer " + userAuth.token
                  }
              })
              .then((response) => {
                  if (response.data) {
                      setResultMap(response.data);
                  }
              })
              .catch((error) => {
                  console.error("Error fetching box count by date:", error);
                  // Handle error appropriately
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
  


    return (
        <div style={{display:"flex", flexDirection: "column"}}>
        <div>
        <p style={{fontWeight:'600'}}>Productivités des entrepôts</p>
        <div >
        <Form style={{display:'flex', flexDirection:'row', justifyContent: 'space-between',gap:'30px'}} onSubmit={handleSubmit(onSubmit)} >
        <div style={{display:'flex', flexDirection:'row', gap:"10px", width:"80%"}}>
        <FloatingLabel controlId="date" label="Date">
    <Form.Control type="month"   {...register('date') }  />
    {errors.date && <span>{errors.date.message}</span>}
  </FloatingLabel>
  
        <Form.Select required   {...register('entrepot')}  aria-label="Default select example" >
        <option >selectionner entrepôt</option>
      {entrepotList?.map(el => (
        
        <option value={el.id}>{el.name}</option>
      ))}
     
    </Form.Select>
    
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
