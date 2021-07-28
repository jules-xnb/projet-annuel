import axios from 'axios'

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

export const updateBid = (newPrice, idBidUpdate, oldPrice,userAddress,userToken) => {
  if (userAddress && userToken && newPrice > oldPrice){ 
    let data = JSON.stringify({
      "id": idBidUpdate,
      "active": true,
      "actualPrice": newPrice,
      "bidderAddress": userAddress
    })

    let config = {
      method: 'put',
      url: 'http://localhost:4000/bid/update',
      headers: { 
        'Authorization': 'Bearer ' + userToken, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config) 
    .then(res => { 
      console.log(res)
      console.log("updated")
    })
  }
  else if(userAddress && userToken && newPrice < oldPrice){
    //TODO si on a le temps > rajouter un message d'erreur indiquant que le prix de surenchérissement
    //est plus faible que le prix actuel
  }
}

