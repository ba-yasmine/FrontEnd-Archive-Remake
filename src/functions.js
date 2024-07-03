export const PaginationCount = (data) => {

    if(Number.isInteger(data.length/10) && !(data.length <10) )
    {
      return Math.floor(data.length/10)-1;
    }

    else if(data.length <10) {
      return Math.floor(data.length/10);
    }

    else{

       return Math.floor(data.length/10);
    }
      
     
}
//https://rmsbackend-production.up.railway.app/

export function fiterPag (num,data) {

  
  const filtered=data.filter((el,id)=>{

    return id >= 10*num && id <10+10*num
})


return filtered;

}






