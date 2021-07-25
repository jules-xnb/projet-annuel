import axios from 'axios';

export const createItem = async (image,comment,userAddress,userToken) => {
    if (userAddress && userToken && image && comment){ 
      let data = JSON.stringify({
        "image" :  image,
        "address" : userAddress,
        "comment" : comment,
      })
  
      let config = {
        method: 'post',
        url: 'http://localhost:4000/item/create',
        headers: { 
          'Authorization': 'Bearer ' + userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      axios(config)
      .then(() => {
        this.getItemsByAddress()
      })
    }
}

export const deleteItem = async (idItem,userAddress,userToken) => {
    if (userAddress && userToken ){ 
        let data = JSON.stringify({
        "id" :  idItem
        })

        let config = {
        method: 'delete',
        url: 'http://localhost:4000/item/delete',
        headers: { 
            'Authorization': 'Bearer ' + userToken, 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios(config)
        .then(res => {
        console.log(res)
        this.getItemsByAddress()
        })
    }
}

export const formCreateItem = (userAddress, tokenWallet) => {
    let valueImage = document.getElementsByClassName('inputImageCI').value;
    let valueComment = document.getElementsByClassName('inputCommentCI').value;
    
    createItem(valueImage,valueComment,userAddress,tokenWallet)
  }