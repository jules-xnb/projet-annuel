import axios from 'axios'

export const createBid = async (dateEnd,price,idItem,userAddress,userToken) => {
  console.log(userToken)
  if (userAddress && userToken){
    // Vérification qu'une enchère n'est pas déja présente pour un item 
    console.log("ok1")
    axios.post("http://localhost:4000/bid/create", { id : idItem })
    .then( res => {
      if (res.status === 200){
        // enchere déja présente pour cet item, impossible de créer une deuxième OU item id item incorrect 
        console.log("enchère déja présente pout cet item ou id item incorrect")
      } 
      else {
        console.log("ok2")
        let data = JSON.stringify({
          "idItem" :  idItem, 
          "dateEnd" : dateEnd,
          "actualPrice" : price,
          "creatorAddress" : userAddress,
      })
      console.log("ok2.2")
      let config = {
      method: 'post',
      url: 'http://localhost:4000/bid/create',
      headers: { 
          'Authorization': 'Bearer ' + userToken, 
          'Content-Type': 'application/json'
      },
      data : data
      };
      console.log("ok3")
      axios(config) 
      console.log("ok4")
      .then(res => {
          console.log("creation enchère") 
          console.log(res)
          // Ce que tu veux que ca fasse en retour 
      })
      }
    })
  }
  else{
      console.log("Bad UserAddress ",userAddress)
      console.log("Bad TokenWallet: ",userToken)
      console.log("Bad dateEnd ",dateEnd)
      console.log("Bad price ",price)
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

