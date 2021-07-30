import axios from 'axios';

export const createBid = async (dateEnd,price,idItem,userAddress,userToken) => {
  console.log("create bid",dateEnd)
  console.log("create bid",price)
  console.log("create bid",idItem)
  console.log("create bid",userAddress)
  if (userAddress && userToken){
    let data = JSON.stringify({
      "idItem" :  idItem,
      "dateEnd" : dateEnd,
      "actualPrice" : price,
      "creatorAddress" : userAddress
    })

    let config = {
      method: 'post',
      url: 'http://localhost:4000/bid/create',
      headers: { 
        'Authorization': 'Bearer ' + userToken, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(() => {
      console.log("bid créé")
    })
  }
}

export const deleteBid = (userAddress,userToken) => {
  if (userAddress && userToken){ 
    let data = JSON.stringify({
      "id" : "60fb5506adecb778f701af88" // A remplacer par une variable
    })

    let config = {
      method: 'delete',
      url: 'http://localhost:4000/bid/delete',
      headers: { 
        'Authorization': 'Bearer ' + userToken, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config) 
    .then(res => { 
      console.log(res) 
      // Ce que tu veux que ca fasse en retour 
    })
  }
}

export const compDates = (endDate,dateNow) => {
  let yED = endDate.substring(0,4)
  let yDN = dateNow.substring(0,4)
  let mED = endDate.substring(5,7)
  let mDN = dateNow.substring(5,7)
  let dED = endDate.substring(8,10)
  let dDN = dateNow.substring(8,10)

  if(yED < yDN) return true;
  else if(yED === yDN && mED < mDN) return true;
  else if(yED === yDN && mED === mDN && dED < dDN) return true;
  else return false;
  
}

export const closeBid = (idBid,userToken) => {
  let data = JSON.stringify({
    "id": idBid,
    "active": false
  })

  let config = {
    method: 'put',
    url: 'http://localhost:4000/bid/close',
    headers: { 
      'Authorization': 'Bearer ' + userToken, 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
}


