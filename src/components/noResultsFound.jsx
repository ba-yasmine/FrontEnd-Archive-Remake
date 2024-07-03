import React from 'react'
import { SiZeromq} from "react-icons/si"

const NoResultsFound = () => {
  return (
    <div style={{width:'100%', display:'flex', justifyContent: 'center', alignItems: 'center', color:'#0243cd', flexDirection:'column', minHeight:'500px'}}>
        <h3>aucun résultat</h3>
        
        <SiZeromq style={{fontSize:'40px', marginTop:'5px'}}/>
    </div>
  )
}

export default NoResultsFound