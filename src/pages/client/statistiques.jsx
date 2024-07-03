import React,{useLayoutEffect,useState, useEffect,useContext} from 'react'
import NavAdmin from '../../components/NavbarAdmin'
import { Doughnut } from 'react-chartjs-2';
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartColumn } from '@fortawesome/free-solid-svg-icons'
import {
    Chart as ChartJS,
    CategoryScale,
    ArcElement,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
import NavBar from "../../components/NavbarClient"
import { Button } from 'bootstrap';
import Card from 'react-bootstrap/Card';
import "../Administrateur/style.css"
import {UserContext} from "../../App"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ChartJS.register(ArcElement, Tooltip, Legend);

const Analyticss = () => {

  const faChartMixe =<FontAwesomeIcon style={{ color:"#0243cd",marginRight:"20px"}} size="2x" icon={faChartColumn}/>
    const [ArrayNum,setArrNum] = useState([]);
    const {userAuth,setUserAuth} = useContext(UserContext);
    const [BoxesbyCompany,setBoxesByCompany] = useState({ labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],});
    const [BoxesbyDepartement,setBoxesByDepartement] = useState({ labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],});
    const [BatchesByStatut,setBatchesByStatut] = useState({ labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],});


   
    



    //recuperes toutes les données retournes par les differentes requetes pour alimenter les composants statistiques 
    useEffect(() => {
     
            axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesByCompany/${userAuth.company}`,{ headers:{
              'Authorization':  "Bearer" + userAuth.token
            }})
            .then((response) =>{
              if (response.data === null) {return;}
               
                setBoxesByCompany( {
                    labels: response.data.map(el => el[0] ),
                    datasets : [
                      {
                        label: 'Nombres de boites par sociétés',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                          ],
                        hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
                        hoverBorderColor: 'rgba(200, 200, 200, 1)',
                        data: response.data.map(el => el[1] )
                      }
                    ]
                  })

                
               

             
                 }
                ) 

                axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesByDepartement/${userAuth.company}`,{ headers:{
                  'Authorization':  "Bearer" + userAuth.token
                }})
                .then((response) =>{
            
                   if (response.data.length === 0) {setBoxesByDepartement([]);   return;}
                   
                  setBoxesByDepartement( {
                        labels: response.data.map(el => el[0] ),
                        datasets : [
                          {
                            label: 'Nombres de boites par société',
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                              ],
                              borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                              ],
                            hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
                            hoverBorderColor: 'rgba(200, 200, 200, 1)',
                            data: response.data.map(el => el[1] )
                          }
                        ]
                      })

                    })

                      
    
                 

        
       
         axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBatchesCountByStatut/${userAuth.company}`,{ headers:{
          'Authorization':  "Bearer" + userAuth.token
        }})
            .then((response) =>{
              if (response.data.length === 0) {setBatchesByStatut([]); return;}
                setBatchesByStatut( {
                    labels: response.data.map(el => el[0] ),
                    datasets : [
                      {
                        label: 'Nombres de boites par sociétés',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                          ],
                        hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
                        hoverBorderColor: 'rgba(200, 200, 200, 1)',
                        data: response.data.map(el => el[1] )
                      }
                    ]
                  })
           
                 }
                ) 

                axios.get(`${process.env.REACT_APP_HOST_VAR}rest/analytics/findBoxesbyTreaement/${userAuth.company}`,{ headers:{
                  'Authorization':  "Bearer" + userAuth.token
                }})
                .then((response) => {
                  setArrNum(response.data)
                  
                 
                })
               
    

        
      },[])
      
  return (
   
   
    <main style={{marginTop:'80px',  padding:'0px'}}>
     
    <h4 style={{textAlign:"center",color:"#0243cd",top:"50px",marginBottom:"100px"}}>{faChartMixe} Statistiques de la société</h4>
    <h4 style={{textAlign:"center",color:"#0243cd",top:"50px",marginBottom:"70px"}}>Nombre de boites par traitement</h4>
    
    <h4 style={{textAlign:"center",color:"#0243cd",top:"50px"}}>Boites par société</h4>
      <div style={{height:"400px", position:"relative", padding:"30px", display:"flex", flexDirection:"column",gap:"50px"}}>
     {BoxesbyCompany !== null ? <Bar  
  options={{ maintainAspectRatio: false }} data={BoxesbyCompany} /> :  <h3 style={{textAlign:"center",color:"#0243cd",top:"50px"}}>Aucunes données trouvées</h3>}   
<div id="circle" style={{display:"flex", justifyContent:"space-between", alignItems: "center",height: "400px",position:"relative",marginTop:"70px", backgroundColor:'white', width:'100%', padding:'20px'}}>
  <div style={{height: "400px", position:"relative", width:"50%"}}>
  <h4 style={{textAlign:"center",color:"#0243cd",top:"50px"}}>Lots selon leur traitement</h4>
  {BatchesByStatut.length !== 0 ?  <Doughnut options={{ maintainAspectRatio: false }} data={BatchesByStatut} /> : <h5 style={{textAlign:"center",color:"#0243cd",top:"50px", marginTop:"100px"}}>Aucunes données trouvées</h5>}

  </div>

<div className="containerStat" style={{height: "400px", position:"relative", width:"50%"}}>
<h4 style={{textAlign:"center",color:"#0243cd",top:"50px"}}>Boites selon le département</h4>
{BoxesbyDepartement.length !== 0 ? <Doughnut options={{ maintainAspectRatio: false }} data={BoxesbyDepartement} />
 :  <h5 style={{textAlign:"center",color:"#0243cd",top:"50px", marginTop:"100px"}}>Aucunes données trouvées</h5>
}
   

</div>
   
</div>


        </div>
         

    </main>
  

  )
}

export default Analyticss